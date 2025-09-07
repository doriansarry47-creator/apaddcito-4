// api/index.ts - Vercel Serverless Function Entry Point
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url } = req;
  
  // Simple routing
  if (url === '/api/' || url === '/api') {
    return res.json({ message: '✅ API is running!', timestamp: new Date().toISOString() });
  }
  
  if (url === '/api/health') {
    return res.json({
      status: 'ok',
      message: 'API is running!', 
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development'
    });
  }
  
  if (url === '/api/ping') {
    return res.json({ message: 'pong 🏓' });
  }

  // For now, return 404 for other routes
  return res.status(404).json({ message: 'API route not found', url });
}


export default app;
