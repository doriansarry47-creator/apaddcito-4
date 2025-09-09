var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { storage } from "./storage.js";
import { AuthService, requireAuth, requireAdmin } from "./auth.js";
import { insertCravingEntrySchema, insertExerciseSessionSchema, insertBeckAnalysisSchema, insertExerciseSchema, insertPsychoEducationContentSchema } from "../shared/schema.js";
import { getDB } from './db.js';
import { sql } from 'drizzle-orm';
export function registerRoutes(app) {
    var _this = this;
    app.get("/api/test-db", function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
        var result, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getDB().execute(sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT 1 as one"], ["SELECT 1 as one"]))))];
                case 1:
                    result = _a.sent();
                    res.json({ ok: true, result: result.rows });
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    console.error("Database connection test failed:", e_1);
                    res.status(500).json({ ok: false, error: e_1 instanceof Error ? e_1.message : String(e_1) });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // ========================
    // 🔐 AUTH ROUTES
    // ========================
    app.post("/api/auth/register", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, email, password, firstName, lastName, role, user, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.body, email = _a.email, password = _a.password, firstName = _a.firstName, lastName = _a.lastName, role = _a.role;
                    if (!email || !password) {
                        return [2 /*return*/, res.status(400).json({ message: "Email et mot de passe requis" })];
                    }
                    return [4 /*yield*/, AuthService.register({
                            email: email,
                            password: password,
                            firstName: firstName,
                            lastName: lastName,
                            role: role,
                        })];
                case 1:
                    user = _b.sent();
                    req.session.user = user;
                    res.json({ user: user }); // ✅ cohérent avec le frontend
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    res.status(400).json({
                        message: error_1 instanceof Error ? error_1.message : "Erreur lors de l'inscription"
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/auth/login", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, email, password, user, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.body, email = _a.email, password = _a.password;
                    if (!email || !password) {
                        return [2 /*return*/, res.status(400).json({ message: "Email et mot de passe requis" })];
                    }
                    return [4 /*yield*/, AuthService.login(email, password)];
                case 1:
                    user = _b.sent();
                    req.session.user = user;
                    res.json({ user: user }); // ✅ cohérent avec le frontend
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _b.sent();
                    res.status(401).json({
                        message: error_2 instanceof Error ? error_2.message : "Erreur de connexion"
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/auth/logout", function (req, res) {
        req.session.destroy(function (err) {
            if (err) {
                return res.status(500).json({ message: "Erreur lors de la déconnexion" });
            }
            res.json({ message: "Logout successful" }); // ✅ cohérent avec le frontend
        });
    });
    app.get("/api/auth/me", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.session || !req.session.user) {
                        return [2 /*return*/, res.json({ user: null })]; // ✅ cohérent avec le frontend
                    }
                    return [4 /*yield*/, AuthService.getUserById(req.session.user.id)];
                case 1:
                    user = _a.sent();
                    res.json({ user: user });
                    return [2 /*return*/];
            }
        });
    }); });
    // ========================
    // 📘 EXERCISES
    // ========================
    app.get("/api/exercises", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var exercises, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, storage.getExercises()];
                case 1:
                    exercises = _a.sent();
                    res.json(exercises);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    res.status(500).json({ message: "Erreur lors de la récupération des exercices" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/exercises", requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var data, exercise, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    data = insertExerciseSchema.parse(req.body);
                    return [4 /*yield*/, storage.createExercise(data)];
                case 1:
                    exercise = _a.sent();
                    res.json(exercise);
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    res.status(400).json({ message: error_4 instanceof Error ? error_4.message : "Validation échouée" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // ========================
    // 📚 PSYCHO EDUCATION
    // ========================
    app.get("/api/psycho-education", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var content, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, storage.getPsychoEducationContent()];
                case 1:
                    content = _a.sent();
                    res.json(content);
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    res.status(500).json({ message: "Erreur lors de la récupération du contenu" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/psycho-education", requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var data, content, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    data = insertPsychoEducationContentSchema.parse(req.body);
                    return [4 /*yield*/, storage.createPsychoEducationContent(data)];
                case 1:
                    content = _a.sent();
                    res.json(content);
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    res.status(400).json({ message: error_6 instanceof Error ? error_6.message : "Validation échouée" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // ========================
    // ⚙️ ADMIN ROUTES
    // ========================
    app.get("/api/admin/exercises", requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var exercises, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, storage.getAllExercises()];
                case 1:
                    exercises = _a.sent();
                    res.json(exercises);
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    res.status(500).json({ message: "Failed to fetch all exercises" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/admin/psycho-education", requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var content, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, storage.getAllPsychoEducationContent()];
                case 1:
                    content = _a.sent();
                    res.json(content);
                    return [3 /*break*/, 3];
                case 2:
                    error_8 = _a.sent();
                    res.status(500).json({ message: "Failed to fetch all psycho-education content" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // ========================
    // 🍫 CRAVINGS
    // ========================
    app.post("/api/cravings", requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var data, entry, error_9;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.user))
                        return [2 /*return*/, res.status(401).json({ message: "Session non valide" })];
                    data = insertCravingEntrySchema.parse(__assign(__assign({}, req.body), { userId: req.session.user.id }));
                    return [4 /*yield*/, storage.createCravingEntry(data)];
                case 1:
                    entry = _b.sent();
                    res.json(entry);
                    return [3 /*break*/, 3];
                case 2:
                    error_9 = _b.sent();
                    res.status(400).json({ message: error_9 instanceof Error ? error_9.message : "Validation failed" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/cravings", requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, limit, entries, error_10;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.user))
                        return [2 /*return*/, res.status(401).json({ message: "Session non valide" })];
                    userId = req.session.user.id;
                    limit = req.query.limit ? parseInt(req.query.limit) : undefined;
                    return [4 /*yield*/, storage.getCravingEntries(userId, limit)];
                case 1:
                    entries = _b.sent();
                    res.json(entries);
                    return [3 /*break*/, 3];
                case 2:
                    error_10 = _b.sent();
                    res.status(500).json({ message: "Failed to fetch craving entries" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/cravings/stats", requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, days, stats, error_11;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.user))
                        return [2 /*return*/, res.status(401).json({ message: "Session non valide" })];
                    userId = req.session.user.id;
                    days = req.query.days ? parseInt(req.query.days) : undefined;
                    return [4 /*yield*/, storage.getCravingStats(userId, days)];
                case 1:
                    stats = _b.sent();
                    res.json(stats);
                    return [3 /*break*/, 3];
                case 2:
                    error_11 = _b.sent();
                    res.status(500).json({ message: "Failed to fetch craving stats" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // ========================
    // 🏋️ EXERCISE SESSIONS
    // ========================
    app.post("/api/exercise-sessions", requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var data, session, error_12;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.user))
                        return [2 /*return*/, res.status(401).json({ message: "Session non valide" })];
                    data = insertExerciseSessionSchema.parse(__assign(__assign({}, req.body), { userId: req.session.user.id }));
                    return [4 /*yield*/, storage.createExerciseSession(data)];
                case 1:
                    session = _b.sent();
                    res.json(session);
                    return [3 /*break*/, 3];
                case 2:
                    error_12 = _b.sent();
                    res.status(400).json({ message: error_12 instanceof Error ? error_12.message : "Validation failed" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/exercise-sessions", requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, limit, sessions, error_13;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.user))
                        return [2 /*return*/, res.status(401).json({ message: "Session non valide" })];
                    userId = req.session.user.id;
                    limit = req.query.limit ? parseInt(req.query.limit) : undefined;
                    return [4 /*yield*/, storage.getExerciseSessions(userId, limit)];
                case 1:
                    sessions = _b.sent();
                    res.json(sessions);
                    return [3 /*break*/, 3];
                case 2:
                    error_13 = _b.sent();
                    res.status(500).json({ message: "Failed to fetch exercise sessions" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // ========================
    // 🧠 BECK ANALYSES
    // ========================
    app.post("/api/beck-analyses", requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var data, analysis, error_14;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.user))
                        return [2 /*return*/, res.status(401).json({ message: "Session non valide" })];
                    data = insertBeckAnalysisSchema.parse(__assign(__assign({}, req.body), { userId: req.session.user.id }));
                    return [4 /*yield*/, storage.createBeckAnalysis(data)];
                case 1:
                    analysis = _b.sent();
                    res.json(analysis);
                    return [3 /*break*/, 3];
                case 2:
                    error_14 = _b.sent();
                    res.status(400).json({ message: error_14 instanceof Error ? error_14.message : "Validation failed" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/beck-analyses", requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, limit, analyses, error_15;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.user))
                        return [2 /*return*/, res.status(401).json({ message: "Session non valide" })];
                    userId = req.session.user.id;
                    limit = req.query.limit ? parseInt(req.query.limit) : undefined;
                    return [4 /*yield*/, storage.getBeckAnalyses(userId, limit)];
                case 1:
                    analyses = _b.sent();
                    res.json(analyses);
                    return [3 /*break*/, 3];
                case 2:
                    error_15 = _b.sent();
                    res.status(500).json({ message: "Failed to fetch Beck analyses" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // ========================
    // 👤 USER ROUTES
    // ========================
    app.get("/api/users/stats", requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, stats, error_16;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.user))
                        return [2 /*return*/, res.status(401).json({ message: "Session non valide" })];
                    userId = req.session.user.id;
                    return [4 /*yield*/, storage.getUserStats(userId)];
                case 1:
                    stats = _b.sent();
                    res.json(stats);
                    return [3 /*break*/, 3];
                case 2:
                    error_16 = _b.sent();
                    res.status(500).json({ message: "Failed to fetch user stats" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/users/badges", requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, badges, error_17;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.user))
                        return [2 /*return*/, res.status(401).json({ message: "Session non valide" })];
                    userId = req.session.user.id;
                    return [4 /*yield*/, storage.getUserBadges(userId)];
                case 1:
                    badges = _b.sent();
                    res.json(badges);
                    return [3 /*break*/, 3];
                case 2:
                    error_17 = _b.sent();
                    res.status(500).json({ message: "Failed to fetch user badges" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/users/profile", requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, user, error_18;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.user))
                        return [2 /*return*/, res.status(401).json({ message: "Session non valide" })];
                    userId = req.session.user.id;
                    return [4 /*yield*/, storage.getUser(userId)];
                case 1:
                    user = _b.sent();
                    if (!user) {
                        return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                    }
                    res.json(user);
                    return [3 /*break*/, 3];
                case 2:
                    error_18 = _b.sent();
                    res.status(500).json({ message: "Failed to fetch user" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.put("/api/users/profile", requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, _a, firstName, lastName, email, updatedUser, error_19;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    if (!((_b = req.session) === null || _b === void 0 ? void 0 : _b.user))
                        return [2 /*return*/, res.status(401).json({ message: "Session non valide" })];
                    userId = req.session.user.id;
                    _a = req.body, firstName = _a.firstName, lastName = _a.lastName, email = _a.email;
                    return [4 /*yield*/, AuthService.updateUser(userId, { firstName: firstName, lastName: lastName, email: email })];
                case 1:
                    updatedUser = _c.sent();
                    res.json(updatedUser);
                    return [3 /*break*/, 3];
                case 2:
                    error_19 = _c.sent();
                    res.status(400).json({ message: error_19 instanceof Error ? error_19.message : "Erreur lors de la mise à jour du profil" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.put("/api/users/password", requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, _a, oldPassword, newPassword, error_20;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    if (!((_b = req.session) === null || _b === void 0 ? void 0 : _b.user))
                        return [2 /*return*/, res.status(401).json({ message: "Session non valide" })];
                    userId = req.session.user.id;
                    _a = req.body, oldPassword = _a.oldPassword, newPassword = _a.newPassword;
                    return [4 /*yield*/, AuthService.updatePassword(userId, oldPassword, newPassword)];
                case 1:
                    _c.sent();
                    res.json({ message: "Mot de passe mis à jour avec succès" });
                    return [3 /*break*/, 3];
                case 2:
                    error_20 = _c.sent();
                    res.status(400).json({ message: error_20 instanceof Error ? error_20.message : "Erreur lors de la mise à jour du mot de passe" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.delete("/api/users/profile", requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, error_21;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.user))
                        return [2 /*return*/, res.status(401).json({ message: "Session non valide" })];
                    userId = req.session.user.id;
                    return [4 /*yield*/, storage.deleteUser(userId)];
                case 1:
                    _b.sent();
                    req.session.destroy(function (err) {
                        if (err) {
                            return res.status(500).json({ message: "Erreur lors de la déconnexion après la suppression du compte" });
                        }
                        res.json({ message: "Compte supprimé avec succès" });
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_21 = _b.sent();
                    res.status(500).json({ message: "Erreur lors de la suppression du compte" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // ========================
    // 🌱 SEED & DEMO
    // ========================
    app.post("/api/demo-user", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var user, error_22;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, storage.createUser({
                            email: "demo@example.com",
                            password: "demo123",
                            firstName: "Utilisateur",
                            lastName: "Demo",
                            role: "patient",
                        })];
                case 1:
                    user = _a.sent();
                    res.json(user);
                    return [3 /*break*/, 3];
                case 2:
                    error_22 = _a.sent();
                    res.status(500).json({ message: "Failed to create demo user" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/seed-data", requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var seedData, error_23;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, import("./seed-data.js")];
                case 1:
                    seedData = (_a.sent()).seedData;
                    return [4 /*yield*/, seedData()];
                case 2:
                    _a.sent();
                    res.json({ message: "Données d'exemple créées avec succès" });
                    return [3 /*break*/, 4];
                case 3:
                    error_23 = _a.sent();
                    res.status(500).json({ message: "Erreur lors de la création des données d'exemple" });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
}
var templateObject_1;
