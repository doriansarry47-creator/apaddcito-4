#!/usr/bin/env tsx
/**
 * Database diagnostic and fix utility for PostgreSQL "relation 'user' does not exist" error
 * This script helps identify and fix issues with user/users table naming conflicts
 */

import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import 'dotenv/config';

const { Pool } = pkg;

interface TableInfo {
  table_name: string;
  table_schema: string;
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
}

class DatabaseDiagnostic {
  private pool: InstanceType<typeof Pool>;
  private db: ReturnType<typeof drizzle>;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }

    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    this.db = drizzle(this.pool);
  }

  async checkTables(): Promise<TableInfo[]> {
    console.log("🔍 Checking for user-related tables...");
    
    const query = `
      SELECT table_name, table_schema 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND (table_name = 'user' OR table_name = 'users')
      ORDER BY table_name;
    `;

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getTableStructure(tableName: string): Promise<ColumnInfo[]> {
    const query = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = $1
      ORDER BY ordinal_position;
    `;

    const result = await this.pool.query(query, [tableName]);
    return result.rows;
  }

  async checkForeignKeys(): Promise<any[]> {
    const query = `
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND (ccu.table_name = 'user' OR ccu.table_name = 'users')
      ORDER BY tc.table_name, kcu.column_name;
    `;

    const result = await this.pool.query(query);
    return result.rows;
  }

  async fixUserTable(): Promise<boolean> {
    console.log("🔧 Attempting to fix user table naming...");
    
    try {
      // Check current state
      const tables = await this.checkTables();
      const hasUserTable = tables.some(t => t.table_name === 'user');
      const hasUsersTable = tables.some(t => t.table_name === 'users');

      if (hasUserTable && !hasUsersTable) {
        console.log("📋 Found 'user' table but no 'users' table. Renaming...");
        await this.pool.query('ALTER TABLE "user" RENAME TO "users"');
        console.log("✅ Successfully renamed 'user' table to 'users'");
        return true;
      } else if (hasUserTable && hasUsersTable) {
        console.log("⚠️  Both 'user' and 'users' tables exist. Manual intervention required.");
        console.log("   You may need to merge data or drop the conflicting table.");
        return false;
      } else if (!hasUserTable && hasUsersTable) {
        console.log("✅ Table naming is correct ('users' table exists)");
        return true;
      } else {
        console.log("❌ Neither 'user' nor 'users' table found. Database may need initialization.");
        return false;
      }
    } catch (error) {
      console.error("❌ Error fixing user table:", error);
      return false;
    }
  }

  async diagnose(): Promise<void> {
    try {
      console.log("🏥 PostgreSQL User Table Diagnostic Report");
      console.log("=" .repeat(50));

      // Check tables
      const tables = await this.checkTables();
      
      if (tables.length === 0) {
        console.log("❌ No user-related tables found!");
        console.log("   → Run migrations: npm run db:push");
        return;
      }

      console.log(`📊 Found ${tables.length} user-related table(s):`);
      for (const table of tables) {
        console.log(`   • ${table.table_schema}.${table.table_name}`);
        
        // Show table structure
        const columns = await this.getTableStructure(table.table_name);
        console.log(`     Columns (${columns.length}):`);
        columns.forEach(col => {
          console.log(`       - ${col.column_name}: ${col.data_type}`);
        });
      }

      // Check foreign keys
      console.log("\n🔗 Foreign Key References:");
      const foreignKeys = await this.checkForeignKeys();
      if (foreignKeys.length === 0) {
        console.log("   No foreign key references found");
      } else {
        foreignKeys.forEach(fk => {
          console.log(`   ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
        });
      }

      // Recommendations
      console.log("\n💡 Recommendations:");
      const hasUserTable = tables.some(t => t.table_name === 'user');
      const hasUsersTable = tables.some(t => t.table_name === 'users');

      if (hasUserTable && !hasUsersTable) {
        console.log("   ⚠️  Found 'user' table (PostgreSQL reserved keyword issue)");
        console.log("   → Run: node scripts/fix-database.ts --fix");
      } else if (!hasUserTable && hasUsersTable) {
        console.log("   ✅ Table naming is correct");
      } else if (hasUserTable && hasUsersTable) {
        console.log("   ⚠️  Conflicting tables detected - manual resolution needed");
      }

    } catch (error) {
      console.error("❌ Diagnostic failed:", error);
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix');

  const diagnostic = new DatabaseDiagnostic();

  try {
    if (shouldFix) {
      const success = await diagnostic.fixUserTable();
      if (success) {
        console.log("🎉 Database fix completed successfully!");
      } else {
        console.log("❌ Fix failed - see messages above");
        process.exit(1);
      }
    } else {
      await diagnostic.diagnose();
      console.log("\n💻 To apply fixes, run: tsx scripts/fix-database.ts --fix");
    }
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  } finally {
    await diagnostic.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}