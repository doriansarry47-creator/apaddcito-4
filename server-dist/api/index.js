// api/index.ts - Vercel Serverless Function Entry Point
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { registerRoutes } from '../server-dist/routes.js';
import '../server-dist/migrate.js';
import { debugTablesRouter } from '../server-dist/debugTables.js';
import { vercelSessionMiddleware } from '../server-dist/vercel-session.js';
// Créer l'application Express
var app = express();
// Configuration CORS adaptée à Vercel
var CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
app.use(cors({
    origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(','),
    credentials: true,
}));
// Parsing JSON
app.use(express.json());
// Configuration session pour Vercel
app.use(vercelSessionMiddleware);
// Endpoints de base
app.get('/', function (_req, res) {
    res.json({
        message: '✅ API Apaddicto est en ligne sur Vercel!',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'production'
    });
});
app.get('/health', function (_req, res) {
    res.json({
        status: 'ok',
        message: 'API is running on Vercel!',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'production'
    });
});
// Enregistrer toutes les routes de l'application
registerRoutes(app);
app.use('/debug', debugTablesRouter);
// Middleware de gestion d'erreurs
app.use(function (err, _req, res, _next) {
    console.error('❌ Erreur serveur Vercel:', err);
    res.status(500).json({
        message: 'Erreur interne du serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal error'
    });
});
// Export par défaut pour Vercel
export default app;
