var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// api/index.ts - Vercel Serverless Function Entry Point
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { registerRoutes } from './routes.js';
import './migrate.js';
import { debugTablesRouter } from './debugTables.js';
import { Pool } from 'pg';
import { vercelSessionMiddleware } from './vercel-session.js';
// === INITIALISATION EXPRESS ===
// Créer l'application Express
var app = express();
// === CONFIG CORS ===
// Configuration CORS adaptée à Vercel
var CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
app.use(cors({
    origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(','),
    credentials: true,
}));
// === PARSING JSON ===
// Parsing JSON
app.use(express.json());
// === SESSION ===
// Configuration session pour Vercel
app.use(vercelSessionMiddleware);
// === ENDPOINTS DE BASE ===
// Endpoints de base
app.get('/', function (_req, res) {
    res.send('API Apaddcito est en ligne !');
    res.json({
        message: '✅ API Apaddicto est en ligne sur Vercel!',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'production'
    });
});
app.get('/api/health', function (_req, res) {
    res.json({
        status: 'ok',
        message: 'API is running on Vercel!',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
});
// === ROUTES DE L'APPLICATION ===
// Enregistrer toutes les routes de l'application
registerRoutes(app);
app.use('/api', debugTablesRouter);
// === CONNEXION POSTGRES ===
var pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'apaddcito',
    password: process.env.DB_PASSWORD || 'ton_mot_de_passe',
    port: Number(process.env.DB_PORT) || 5432,
});
// === ENDPOINT POUR LISTER LES TABLES ===
app.get('/api/tables', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, pool.query("\n      SELECT table_name\n      FROM information_schema.tables\n      WHERE table_schema = 'public'\n      ORDER BY table_name;\n    ")];
            case 1:
                result = _a.sent();
                res.json(result.rows.map(function (r) { return r.table_name; }));
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.error(err_1);
                res.status(500).json({ message: 'Erreur serveur' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// === ENDPOINT POUR RENVOYER LE CONTENU DE TOUTES LES TABLES ===
app.get('/api/data', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tables, data, _i, tables_1, table, result, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                tables = [
                    "beck_analyses",
                    "craving_entries",
                    "exercise_sessions",
                    "exercises",
                    "psycho_education_content",
                    "user_badges",
                    "user_stats",
                    "users"
                ];
                data = {};
                _i = 0, tables_1 = tables;
                _a.label = 1;
            case 1:
                if (!(_i < tables_1.length)) return [3 /*break*/, 4];
                table = tables_1[_i];
                return [4 /*yield*/, pool.query("SELECT * FROM ".concat(table, ";"))];
            case 2:
                result = _a.sent();
                data[table] = result.rows;
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                res.json(data);
                return [3 /*break*/, 6];
            case 5:
                err_2 = _a.sent();
                console.error(err_2);
                res.status(500).json({ message: 'Erreur serveur' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// === MIDDLEWARE DE GESTION D'ERREURS ===
// Middleware de gestion d'erreurs
app.use(function (err, _req, res, _next) {
    console.error('❌ Erreur serveur:', err.message);
    res.status(500).json({ message: 'Erreur interne', error: err.message });
});
// === DEBUG ROUTES DISPONIBLES ===
console.log("Routes disponibles :");
app._router.stack.forEach(function (r) {
    if (r.route && r.route.path) {
        console.log(r.route.path);
    }
});
// === LANCEMENT DU SERVEUR ===
var port = Number(process.env.PORT) || 3000;
app.listen(port, '0.0.0.0', function () {
    console.log("\uD83D\uDE80 Server running at http://localhost:".concat(port));
});
// Export par défaut pour Vercel
export default app;
