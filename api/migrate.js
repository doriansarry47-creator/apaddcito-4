import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pkg from 'pg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function handler(req, res) {
  // Seulement permettre POST pour des raisons de sécurité
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vérifier un token simple pour éviter les exécutions non autorisées
  const authToken = req.headers.authorization;
  if (!authToken || authToken !== `Bearer ${process.env.MIGRATION_TOKEN || 'migrate-token'}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL manquant');
    }

    console.log('🔧 Démarrage des migrations...');
    
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    const db = drizzle(pool);
    
    // Chemin vers le dossier migrations depuis l'API
    const migrationsPath = join(__dirname, '..', 'migrations');
    
    if (!fs.existsSync(migrationsPath)) {
      throw new Error('Dossier migrations introuvable');
    }

    await migrate(db, { migrationsFolder: migrationsPath });
    
    await pool.end();
    
    console.log('✅ Migrations terminées');
    
    res.status(200).json({ 
      success: true, 
      message: 'Migrations appliquées avec succès' 
    });
    
  } catch (error) {
    console.error('❌ Erreur migrations:', error);
    res.status(500).json({ 
      error: 'Erreur lors des migrations', 
      details: error.message 
    });
  }
}

