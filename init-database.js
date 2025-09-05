#!/usr/bin/env node
/**
 * Script to initialize the database tables for Apaddicto
 * This script applies all the necessary table creations from the Drizzle schema
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql } from 'drizzle-orm';
import ws from 'ws';
import 'dotenv/config';

// Configure Neon
neonConfig.webSocketConstructor = ws;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

console.log('🚀 Initializing Apaddicto database...');
console.log('📊 Database URL:', DATABASE_URL.replace(/:[^:@]*@/, ':****@'));

async function initializeDatabase() {
  let pool;
  let db;
  
  try {
    pool = new Pool({ connectionString: DATABASE_URL });
    db = drizzle({ client: pool });
    
    console.log('✅ Connected to database');
    
    // Test connection first
    await db.execute(sql`SELECT 1 as test`);
    console.log('✅ Database connection verified');
    
    // Create tables in order (dependencies matter)
    console.log('🔧 Creating users table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR UNIQUE NOT NULL,
        password VARCHAR NOT NULL,
        first_name VARCHAR,
        last_name VARCHAR,
        profile_image_url VARCHAR,
        role VARCHAR DEFAULT 'patient',
        level INTEGER DEFAULT 1,
        points INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('🔧 Creating exercises table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS exercises (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR NOT NULL,
        description TEXT,
        category VARCHAR NOT NULL,
        difficulty VARCHAR DEFAULT 'beginner',
        duration INTEGER,
        instructions TEXT,
        benefits TEXT,
        image_url VARCHAR,
        video_url VARCHAR,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('🔧 Creating psycho_education_content table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS psycho_education_content (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR NOT NULL,
        type VARCHAR DEFAULT 'article',
        difficulty VARCHAR DEFAULT 'beginner',
        estimated_read_time INTEGER,
        image_url VARCHAR,
        video_url VARCHAR,
        audio_url VARCHAR,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('🔧 Creating craving_entries table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS craving_entries (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL,
        intensity INTEGER NOT NULL,
        triggers JSONB DEFAULT '[]',
        emotions JSONB DEFAULT '[]',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('🔧 Creating exercise_sessions table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS exercise_sessions (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL,
        exercise_id VARCHAR NOT NULL,
        duration INTEGER,
        completed BOOLEAN DEFAULT false,
        craving_before INTEGER,
        craving_after INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('🔧 Creating beck_analyses table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS beck_analyses (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL,
        situation TEXT,
        automatic_thoughts TEXT,
        emotions TEXT,
        emotion_intensity INTEGER,
        rational_response TEXT,
        new_feeling TEXT,
        new_intensity INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('🔧 Creating user_badges table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_badges (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL,
        badge_type VARCHAR NOT NULL,
        earned_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('🔧 Creating user_stats table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_stats (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL,
        exercises_completed INTEGER DEFAULT 0,
        total_duration INTEGER DEFAULT 0,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        average_craving INTEGER,
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT user_stats_user_id_unique UNIQUE(user_id)
      );
    `);
    
    console.log('🎉 All database tables created successfully!');
    console.log('✅ Database initialization complete');
    
    // Verify tables were created
    const result = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('📊 Created tables:');
    result.rows.forEach(row => {
      console.log('  ✓', row.table_name);
    });
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

// Run the initialization
initializeDatabase();