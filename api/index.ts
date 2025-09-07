// api/index.ts - Vercel Serverless Function Entry Point
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
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

  const url = req.url || '';
  console.log(`API Request: ${req.method} ${url}`);
  
  // Simple routing based on URL path
  if (url.endsWith('/') || url === '') {
    return res.status(200).json({ 
      message: '✅ API is running!', 
      timestamp: new Date().toISOString(),
      method: req.method,
      url: url
    });
  }
  
  if (url.endsWith('/health')) {
    return res.status(200).json({
      status: 'ok',
      message: 'API is running!', 
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development',
      url: url
    });
  }
  
  if (url.endsWith('/ping')) {
    return res.status(200).json({ 
      message: 'pong 🏓',
      timestamp: new Date().toISOString(),
      url: url
    });
  }

  // For debugging: return info about the request
  return res.status(404).json({ 
    message: 'API route not found', 
    method: req.method,
    url: url,
    timestamp: new Date().toISOString()
  });
}


export default app;
