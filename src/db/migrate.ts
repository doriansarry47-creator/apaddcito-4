import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as fs from 'fs';

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL manquant');
    console.error('Assurez-vous que la variable d\'environnement DATABASE_URL est définie dans votre fichier .env');
    process.exit(1);
  }

  if (!fs.existsSync('migrations')) {
    console.log('ℹ️ Dossier migrations/ absent, exécution ignorée.');
    console.log('Veuillez d\'abord générer les migrations avec : npx drizzle-kit generate');
    return;
  }

  console.log('🔧 Migration runner: démarrage');
  console.log('📁 Dossier de migrations: migrations/');
  
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  
  const db = drizzle(pool);
  
  try {
    console.log('🚀 Application des migrations...');
    await migrate(db, { migrationsFolder: 'migrations' });
    console.log('✅ Migrations appliquées avec succès (ou déjà à jour)');
  } catch (e) {
    console.error('❌ Erreur lors de l\'application des migrations:', e);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();