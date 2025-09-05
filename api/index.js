import express from 'express';
import session from 'express-session';
import memorystore from 'memorystore';
import bcrypt from 'bcryptjs';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql, eq, and } from 'drizzle-orm';
import ws from 'ws';
import { 
  users, 
  exercises, 
  psychoEducationContent,
  cravingEntries,
  exerciseSessions 
} from '../shared/schema.js';

// Configure Neon
neonConfig.webSocketConstructor = ws;

const app = express();

// Database configuration
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_vRJU7LlnYG1y@ep-soft-bush-ab0hbww0-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

console.log('🚀 Starting Apaddicto API server...');

let db;

try {
  const pool = new Pool({ connectionString: DATABASE_URL });
  db = drizzle({ client: pool, schema: { users, exercises, psychoEducationContent, cravingEntries, exerciseSessions } });
  console.log('✅ Database initialized successfully');
} catch (error) {
  console.error('❌ Database initialization failed:', error);
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
    name: 'apaddicto_session',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  }),
);

// CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Authentication helpers
class AuthService {
  static async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static async getUserByEmail(email) {
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  static async createUser(userData) {
    try {
      const result = await db.insert(users).values(userData).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getUserById(id) {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }
}

// Auth middleware
function requireAuth(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ message: 'Authentification requise' });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ message: 'Authentification requise' });
  }
  
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès administrateur requis' });
  }
  
  next();
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'apaddicto-api',
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// Database test
app.get('/api/test-db', async (req, res) => {
  try {
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

// Authentication routes
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
    const existingUser = await AuthService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
    }

    // Hash password
    const hashedPassword = await AuthService.hashPassword(password);

    // Create user
    const newUser = await AuthService.createUser({
      email,
      password: hashedPassword,
      firstName: firstName || null,
      lastName: lastName || null,
      role: role || 'patient'
    });

    // Create session
    req.session.user = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role
    };

    console.log('✅ User registered successfully:', email);
    
    res.json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Erreur lors de la création du compte' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔑 Login attempt for:', email);
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Get user
    const user = await AuthService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Verify password
    const isValidPassword = await AuthService.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Create session
    req.session.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };

    console.log('✅ User logged in successfully:', email);

    res.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    }
    res.json({ message: 'Déconnexion réussie' });
  });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.session.user });
});

// Exercise routes
app.get('/api/exercises', requireAuth, async (req, res) => {
  try {
    const allExercises = await db.select().from(exercises).where(eq(exercises.isActive, true));
    res.json(allExercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des exercices' });
  }
});

app.post('/api/exercises', requireAdmin, async (req, res) => {
  try {
    const { title, description, duration, difficulty, category, instructions } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Titre et description requis' });
    }

    const newExercise = await db.insert(exercises).values({
      title,
      description,
      duration: duration || 15,
      difficulty: difficulty || 'beginner',
      category: category || 'general',
      instructions: instructions || null,
      createdAt: new Date()
    }).returning();

    res.json(newExercise[0]);
  } catch (error) {
    console.error('Error creating exercise:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'exercice' });
  }
});

// Psycho-education routes
app.get('/api/psycho-education', requireAuth, async (req, res) => {
  try {
    const content = await db.select().from(psychoEducationContent).where(eq(psychoEducationContent.isActive, true));
    res.json(content);
  } catch (error) {
    console.error('Error fetching psycho-education content:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du contenu' });
  }
});

app.post('/api/psycho-education', requireAdmin, async (req, res) => {
  try {
    const { title, content, category, readingTime } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Titre et contenu requis' });
    }

    const newContent = await db.insert(psychoEducationContent).values({
      title,
      content,
      category: category || 'general',
      readingTime: readingTime || 5,
      createdAt: new Date()
    }).returning();

    res.json(newContent[0]);
  } catch (error) {
    console.error('Error creating psycho-education content:', error);
    res.status(500).json({ message: 'Erreur lors de la création du contenu' });
  }
});

// Craving tracking routes
app.post('/api/cravings', requireAuth, async (req, res) => {
  try {
    const { intensity, triggers, notes } = req.body;
    
    const newCraving = await db.insert(cravingEntries).values({
      userId: req.session.user.id,
      intensity: intensity || 1,
      triggers: triggers || null,
      notes: notes || null,
      createdAt: new Date()
    }).returning();

    res.json(newCraving[0]);
  } catch (error) {
    console.error('Error creating craving entry:', error);
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement' });
  }
});

app.get('/api/cravings', requireAuth, async (req, res) => {
  try {
    const userCravings = await db.select()
      .from(cravingEntries)
      .where(eq(cravingEntries.userId, req.session.user.id));
    
    res.json(userCravings);
  } catch (error) {
    console.error('Error fetching cravings:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération' });
  }
});

// Exercise session routes
app.post('/api/exercise-sessions', requireAuth, async (req, res) => {
  try {
    const { exerciseId, duration, completed, notes } = req.body;
    
    const newSession = await db.insert(exerciseSessions).values({
      userId: req.session.user.id,
      exerciseId: exerciseId || null,
      duration: duration || 0,
      completed: completed || false,
      notes: notes || null,
      createdAt: new Date()
    }).returning();

    res.json(newSession[0]);
  } catch (error) {
    console.error('Error creating exercise session:', error);
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement' });
  }
});

app.get('/api/exercise-sessions', requireAuth, async (req, res) => {
  try {
    const userSessions = await db.select()
      .from(exerciseSessions)
      .where(eq(exerciseSessions.userId, req.session.user.id));
    
    res.json(userSessions);
  } catch (error) {
    console.error('Error fetching exercise sessions:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ message: 'Erreur interne du serveur' });
});

// Export for Vercel
export default app;