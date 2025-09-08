import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pkg from 'pg';
import fs from 'fs';
import * as schema from '../shared/schema.js';

const { Pool } = pkg;

async function fixDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL manquant dans les variables d\'environnement');
    console.log('Veuillez définir DATABASE_URL dans votre fichier .env');
    return;
  }

  console.log('🔧 Correction de la base de données...');
  
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  
  const db = drizzle(pool, { schema });

  try {
    // Vérifier la connexion
    console.log('📡 Test de connexion à la base de données...');
    await pool.query('SELECT 1');
    console.log('✅ Connexion réussie');

    // Vérifier si la table users existe
    console.log('🔍 Vérification de l\'existence de la table users...');
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('⚠️ Table users n\'existe pas, exécution des migrations...');
      
      if (fs.existsSync('migrations')) {
        await migrate(db, { migrationsFolder: 'migrations' });
        console.log('✅ Migrations appliquées avec succès');
      } else {
        console.error('❌ Dossier migrations/ introuvable');
        return;
      }
    } else {
      console.log('✅ Table users existe déjà');
    }

    // Vérifier la structure de la table
    console.log('🔍 Vérification de la structure de la table users...');
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Colonnes de la table users:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    // Compter les utilisateurs existants
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    console.log(`👥 Nombre d'utilisateurs dans la base: ${userCount.rows[0].count}`);

    console.log('🎉 Base de données vérifiée et corrigée avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors de la correction de la base de données:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Exécuter le script si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  fixDatabase().catch(console.error);
}

export { fixDatabase };

