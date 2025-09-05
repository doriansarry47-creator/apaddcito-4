import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@shared/schema.js';

// Configure Neon for edge runtime
neonConfig.webSocketConstructor = ws;

let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!db) {
    const DATABASE_URL = process.env.DATABASE_URL;
    
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL must be set. Did you forget to provision a database?');
    }
    
    console.log('🔗 Connecting to database:', DATABASE_URL.replace(/:[^:@]*@/, ':****@'));
    
    const pool = new Pool({ connectionString: DATABASE_URL });
    db = drizzle(pool, { schema });
    
    console.log('✅ Database connection established');
  }
  
  return db;
}

export { schema };