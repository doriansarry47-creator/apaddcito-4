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
import { Router } from 'express';
import pkg from 'pg';
var Pool = pkg.Pool;
export var debugTablesRouter = Router();
function ensureDbUrl() {
    var url = process.env.DATABASE_URL;
    if (!url)
        throw new Error('DATABASE_URL manquant');
    return url;
}
function makePool() {
    return new Pool({ connectionString: ensureDbUrl() });
}
// GET /api/debug/tables
debugTablesRouter.get('/debug/tables', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var pool, tables, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pool = makePool();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 6]);
                return [4 /*yield*/, pool.query("\n      SELECT table_name\n      FROM information_schema.tables\n      WHERE table_schema = 'public'\n      ORDER BY table_name;\n    ")];
            case 2:
                tables = _a.sent();
                res.json({ tables: tables.rows.map(function (r) { return r.table_name; }) });
                return [3 /*break*/, 6];
            case 3:
                e_1 = _a.sent();
                res.status(500).json({ error: e_1.message });
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, pool.end()];
            case 5:
                _a.sent();
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); });
// GET /api/debug/tables/counts
debugTablesRouter.get('/debug/tables/counts', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var pool, tables, out, _i, _a, row, tableName, count, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                pool = makePool();
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, 8, 10]);
                return [4 /*yield*/, pool.query("\n      SELECT table_name\n      FROM information_schema.tables\n      WHERE table_schema = 'public'\n      ORDER BY table_name;\n    ")];
            case 2:
                tables = _b.sent();
                out = {};
                _i = 0, _a = tables.rows;
                _b.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                row = _a[_i];
                tableName = row.table_name;
                return [4 /*yield*/, pool.query("SELECT COUNT(*)::int AS c FROM \"".concat(tableName, "\";"))];
            case 4:
                count = _b.sent();
                out[tableName] = count.rows[0].c;
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                res.json(out);
                return [3 /*break*/, 10];
            case 7:
                e_2 = _b.sent();
                res.status(500).json({ error: e_2.message });
                return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, pool.end()];
            case 9:
                _b.sent();
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); });
// DELETE /api/debug/tables/purge
debugTablesRouter.delete('/debug/tables/purge', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var pool, tables, _i, _a, row, tableName, e_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (process.env.NODE_ENV === 'production') {
                    return [2 /*return*/, res.status(403).json({ error: 'Purge interdite en production' })];
                }
                pool = makePool();
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, 8, 10]);
                return [4 /*yield*/, pool.query("\n      SELECT table_name\n      FROM information_schema.tables\n      WHERE table_schema = 'public'\n        AND table_type='BASE TABLE'\n      ORDER BY table_name;\n    ")];
            case 2:
                tables = _b.sent();
                _i = 0, _a = tables.rows;
                _b.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                row = _a[_i];
                tableName = row.table_name;
                return [4 /*yield*/, pool.query("TRUNCATE TABLE \"".concat(tableName, "\" RESTART IDENTITY CASCADE;"))];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                res.json({ ok: true });
                return [3 /*break*/, 10];
            case 7:
                e_3 = _b.sent();
                res.status(500).json({ error: e_3.message });
                return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, pool.end()];
            case 9:
                _b.sent();
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); });
