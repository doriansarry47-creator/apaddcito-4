import express from 'express';
import { sql, eq } from 'drizzle-orm';
import { getDb } from './db.js';
import { AuthService, requireAuth, requireAdmin } from './auth.js';
import { users, exercises, cravingEntries, exerciseSessions, psychoEducationContent } from '@shared/schema.js';
import { seedDatabase } from './seed-data.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'apaddicto-server',
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// Database test
router.get('/test-db', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.execute(sql`SELECT 1 as test, NOW() as current_time`);
    res.json({ 
      ok: true, 
      message: 'Database connection successful', 
      result: result.rows,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({ 
      ok: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Initialize database tables
router.get('/init-db', async (req, res) => {
  try {
    const db = getDb();
    
    // Create tables if they don't exist
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
      )
    `);
    
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
      )
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS craving_entries (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL,
        intensity INTEGER NOT NULL,
        triggers JSONB DEFAULT '[]',
        emotions JSONB DEFAULT '[]',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS exercise_sessions (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL,
        exercise_id VARCHAR,
        duration INTEGER,
        completed BOOLEAN DEFAULT false,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS psycho_education_content (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR NOT NULL,
        image_url VARCHAR,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    res.json({ 
      ok: true, 
      message: 'Database tables initialized successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database initialization failed:', error);
    res.status(500).json({ 
      ok: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Seed database with initial data
router.get('/seed-db', async (req, res) => {
  try {
    await seedDatabase();
    res.json({ 
      ok: true, 
      message: 'Database seeded successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database seeding failed:', error);
    res.status(500).json({ 
      ok: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Auth routes
router.post('/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await AuthService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = await AuthService.createUser({
      email,
      password,
      firstName,
      lastName,
      role: role || 'patient'
    });

    // Set session
    req.session.userId = user.id;
    req.session.userRole = user.role;

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user
    const user = await AuthService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await AuthService.verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set session
    req.session.userId = user.id;
    req.session.userRole = user.role;

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

router.get('/auth/me', requireAuth, async (req, res) => {
  try {
    const user = await AuthService.getUserById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Exercises routes
router.get('/exercises', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.select().from(exercises).where(eq(exercises.isActive, true));
    res.json(result);
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({ error: 'Failed to get exercises' });
  }
});

router.post('/exercises', requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.insert(exercises).values(req.body).returning();
    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Create exercise error:', error);
    res.status(500).json({ error: 'Failed to create exercise' });
  }
});

// Psycho-education content routes
router.get('/psycho-education', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.select().from(psychoEducationContent).where(eq(psychoEducationContent.isActive, true));
    res.json(result);
  } catch (error) {
    console.error('Get psycho-education content error:', error);
    res.status(500).json({ error: 'Failed to get psycho-education content' });
  }
});

router.post('/psycho-education', requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.insert(psychoEducationContent).values(req.body).returning();
    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Create psycho-education content error:', error);
    res.status(500).json({ error: 'Failed to create psycho-education content' });
  }
});

// Craving entries routes
router.get('/craving-entries', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.select().from(cravingEntries).where(eq(cravingEntries.userId, req.session.userId));
    res.json(result);
  } catch (error) {
    console.error('Get craving entries error:', error);
    res.status(500).json({ error: 'Failed to get craving entries' });
  }
});

router.post('/craving-entries', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.insert(cravingEntries).values({
      ...req.body,
      userId: req.session.userId
    }).returning();
    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Create craving entry error:', error);
    res.status(500).json({ error: 'Failed to create craving entry' });
  }
});

// Exercise sessions routes
router.get('/exercise-sessions', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.select().from(exerciseSessions).where(eq(exerciseSessions.userId, req.session.userId));
    res.json(result);
  } catch (error) {
    console.error('Get exercise sessions error:', error);
    res.status(500).json({ error: 'Failed to get exercise sessions' });
  }
});

router.post('/exercise-sessions', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.insert(exerciseSessions).values({
      ...req.body,
      userId: req.session.userId
    }).returning();
    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Create exercise session error:', error);
    res.status(500).json({ error: 'Failed to create exercise session' });
  }
});

export default router;