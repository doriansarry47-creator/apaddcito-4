import "dotenv/config";
import express from "express";
import session from "express-session";
import cors from "cors";
import { registerRoutes } from "./routes.js";
import { pool } from "./db.js";

const app = express();
const port = process.env.PORT || 3000;

// CORS middleware (configurable via CORS_ORIGIN)
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration with strengthened cookie options
app.use(session({
  secret: process.env.SESSION_SECRET || "fallback-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  }
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'apaddicto-server',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Register API routes
registerRoutes(app);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Server error:', err);
  
  // Don't leak stack traces in production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(err.status || 500).json({
    message: err.message || 'Erreur interne du serveur',
    ...(isDevelopment && { stack: err.stack })
  });
});

// Start server
const server = app.listen(port, () => {
  console.log(`🚀 Apaddicto server running at http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
  console.log(`🌍 CORS origin: ${corsOrigin}`);
  console.log(`🔒 Session security: ${process.env.NODE_ENV === 'production' ? 'Production (secure)' : 'Development'}`);
});

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  console.log(`\n⏹️  Received ${signal}, shutting down gracefully...`);
  
  server.close(async () => {
    console.log('🔌 HTTP server closed');
    
    try {
      // End database pool connections
      await pool.end();
      console.log('🗃️  Database pool closed');
    } catch (error) {
      console.error('❌ Error closing database pool:', error);
    }
    
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  });
  
  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    console.error('⚠️  Forceful shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});
