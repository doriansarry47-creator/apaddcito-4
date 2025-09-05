import express from 'express';
import session from 'express-session';
import memorystore from 'memorystore';
import bcrypt from 'bcryptjs';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql, eq } from 'drizzle-orm';
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import ws from 'ws';
import path from 'path';

// Configure Neon
neonConfig.webSocketConstructor = ws;

const app = express();
const port = process.env.PORT || 3000;

// Database configuration
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_vRJU7LlnYG1y@ep-soft-bush-ab0hbww0-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

console.log('🚀 Starting Apaddicto server...');
console.log('📊 Database URL:', DATABASE_URL.replace(/:[^:@]*@/, ':****@'));

// Define tables directly in the server
const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("patient"), // 'patient' or 'admin'
  level: integer("level").default(1),
  points: integer("points").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

const exercises = pgTable("exercises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  difficulty: varchar("difficulty").default("beginner"),
  duration: integer("duration"),
  instructions: text("instructions"),
  benefits: text("benefits"),
  imageUrl: varchar("image_url"),
  videoUrl: varchar("video_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

const cravingEntries = pgTable("craving_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  intensity: integer("intensity").notNull(),
  triggers: text("triggers"),
  copingStrategies: text("coping_strategies"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

const exerciseSessions = pgTable("exercise_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  exerciseId: varchar("exercise_id").references(() => exercises.id),
  duration: integer("duration"),
  completed: boolean("completed").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

let db: any;

try {
  const pool = new Pool({ connectionString: DATABASE_URL });
  db = drizzle({ client: pool, schema: { users, exercises, cravingEntries, exerciseSessions } });
  console.log('✅ Database initialized successfully');
} catch (error) {
  console.error('❌ Database initialization failed:', error);
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
const MemoryStore = memorystore(session);
app.use(
  session({
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET || 'Apaddicto2024SecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production' && process.env.VERCEL_URL ? true : false,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
    },
  })
);

// Auth service
class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

// Auth middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.session?.user) {
    return res.status(401).json({ message: 'Authentification requise' });
  }
  next();
};

// Health check
app.get('/health', async (req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    res.json({ status: 'OK', database: 'Connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', database: 'Disconnected', error: error.message });
  }
});

// Database test endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.execute(sql`SELECT current_database(), current_user, version()`);
    res.json({ 
      status: 'OK', 
      database: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      error: error.message 
    });
  }
});

// Database initialization endpoint
app.get('/api/init-db', async (req, res) => {
  try {
    // Create users table
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

    // Create exercises table
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

    // Create craving_entries table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS craving_entries (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR REFERENCES users(id),
        intensity INTEGER NOT NULL,
        triggers TEXT,
        coping_strategies TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create exercise_sessions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS exercise_sessions (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR REFERENCES users(id),
        exercise_id VARCHAR REFERENCES exercises(id),
        duration INTEGER,
        completed BOOLEAN DEFAULT false,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Database tables initialized');
    res.json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    console.log('📝 Registration attempt for:', email);
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
    }

    // Check if user already exists
    const existingUser = await db.execute(sql`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Un utilisateur avec cet email existe déjà" });
    }

    // Hash password
    const hashedPassword = await AuthService.hashPassword(password);

    // Create user using raw SQL to avoid schema issues
    const result = await db.execute(sql`
      INSERT INTO users (email, password, first_name, last_name, role, is_active, created_at)
      VALUES (${email}, ${hashedPassword}, ${firstName || null}, ${lastName || null}, ${role || 'patient'}, true, NOW())
      RETURNING id, email, first_name, last_name, role
    `);

    const newUser = result.rows[0];

    // Set session
    req.session.user = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      role: newUser.role,
    };

    console.log('✅ User registered successfully:', email);
    
    res.json({ 
      user: req.session.user, 
      message: "Inscription réussie" 
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ 
      message: error.message || "Erreur lors de l'inscription" 
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Login attempt for:', email);
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    // Find user by email using raw SQL
    const result = await db.execute(sql`
      SELECT id, email, password, first_name, last_name, role, is_active
      FROM users 
      WHERE email = ${email}
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await AuthService.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({ message: 'Compte désactivé' });
    }

    // Set session
    req.session.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
    };

    console.log('✅ User logged in successfully:', email);

    res.json({ 
      user: req.session.user, 
      message: "Connexion réussie" 
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      message: error.message || "Erreur lors de la connexion" 
    });
  }
});

app.post('/api/auth/logout', (req, res) => {
  const userEmail = req.session?.user?.email;
  req.session.destroy((err: any) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    }
    console.log('👋 User logged out:', userEmail);
    res.json({ message: 'Déconnexion réussie' });
  });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.session.user });
});

// Static file serving
app.use(express.static(path.join(process.cwd(), 'dist/public')));

// Catch all for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist/public', 'index.html'));
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ message: 'Erreur interne du serveur' });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Apaddicto server is running on port ${port}`);
  console.log(`📊 Health check: /health`);
  console.log(`🔍 Database test: /api/test-db`);
  console.log(`🔧 Initialize DB: /api/init-db`);
  console.log(`🚪 Available endpoints:`);
  console.log(`   POST /api/auth/register - Créer un compte`);
  console.log(`   POST /api/auth/login - Se connecter`);
  console.log(`   POST /api/auth/logout - Se déconnecter`);
  console.log(`   GET  /api/auth/me - Profil utilisateur`);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  process.exit(0);
});