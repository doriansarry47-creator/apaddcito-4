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

let db: any;

try {
  const pool = new Pool({ connectionString: DATABASE_URL });
  db = drizzle({ client: pool, schema: { users, exercises } });
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
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
    },
  })
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database test endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.execute(sql`SELECT NOW() as current_time`);
    res.json({ 
      success: true, 
      message: 'Database connection successful',
      time: result.rows[0]?.current_time 
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed' 
    });
  }
});

// API routes
app.get('/api/exercises', async (req, res) => {
  try {
    const allExercises = await db.select().from(exercises).where(eq(exercises.isActive, true));
    res.json(allExercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des exercices' });
  }
});

// Auth endpoint for testing
app.get('/api/auth/me', (req, res) => {
  if (req.session && (req.session as any).user) {
    res.json({ user: (req.session as any).user });
  } else {
    res.status(401).json({ message: 'Non authentifié' });
  }
});

// Serve static files from dist/public
app.use(express.static(path.join(process.cwd(), 'dist/public')));

// Catch all handler for SPA routing
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
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🔍 Database test: http://localhost:${port}/api/test-db`);
});

export default app;