import express from 'express';
import session from 'express-session';
import memorystore from 'memorystore';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import routes from './routes.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

console.log('🚀 Starting Apaddicto server...');

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
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax'
    },
  }),
);

// CORS middleware for development
if (process.env.NODE_ENV !== 'production') {
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
}

// API routes
app.use('/api', routes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, '../../dist/public');
  app.use(express.static(publicPath));
  
  // Serve React app for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
} else {
  // Development root route
  app.get('/', (req, res) => {
    res.json({
      message: 'Apaddicto API Server',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      endpoints: {
        health: '/api/health',
        auth: {
          register: 'POST /api/auth/register',
          login: 'POST /api/auth/login',
          logout: 'POST /api/auth/logout',
          me: 'GET /api/auth/me'
        },
        exercises: 'GET /api/exercises',
        psychoEducation: 'GET /api/psycho-education',
        cravingEntries: 'GET /api/craving-entries',
        exerciseSessions: 'GET /api/exercise-sessions'
      }
    });
  });
}

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${port}/api/health`);
  console.log(`🔍 Database test: http://localhost:${port}/api/test-db`);
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

export default app;