import express from 'express';
import { Request, Response } from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    service: 'apaddicto-server',
    timestamp: new Date().toISOString()
  });
});

// API test endpoint
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ 
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
});

// Static file serving - serve the built client
const staticPath = path.resolve(process.cwd(), 'dist/public');
app.use(express.static(staticPath));

// Catch all handler for SPA routing
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`✅ Apaddicto server is running on port ${port}`);
    console.log(`📊 Health check: http://localhost:${port}/health`);
    console.log(`🔧 API test: http://localhost:${port}/api/test`);
  });
}

export default app;