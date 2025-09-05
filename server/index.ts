import express from 'express';
import session from 'express-session';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure Neon WebSocket
neonConfig.webSocketConstructor = ws;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Database configuration
const DATABASE_URL = process.env.DATABASE_URL;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'Apaddicto2024SecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Apaddicto server is running' });
});

// API routes
app.get('/api/test-db', async (req, res) => {
  try {
    if (!DATABASE_URL) {
      return res.status(500).json({ 
        success: false, 
        message: 'DATABASE_URL not configured' 
      });
    }
    
    const pool = new Pool({ connectionString: DATABASE_URL });
    const db = drizzle(pool);
    
    // Simple test query
    const result = await pool.query('SELECT NOW() as current_time');
    
    res.json({ 
      success: true, 
      message: 'Database connection successful',
      timestamp: result.rows[0].current_time
    });
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Serve static files from build output
app.use(express.static(path.join(__dirname, '../public')));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const server = app.listen(port, () => {
  console.log(`✅ Apaddicto server running on port ${port}`);
  console.log(`🔍 Health check: http://localhost:${port}/health`);
  console.log(`🔧 Database test: http://localhost:${port}/api/test-db`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;