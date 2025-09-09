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
import bcrypt from 'bcryptjs';
import { storage } from './storage.js';
var AuthService = /** @class */ (function () {
    function AuthService() {
    }
    AuthService.hashPassword = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var saltRounds;
            return __generator(this, function (_a) {
                saltRounds = 10;
                return [2 /*return*/, bcrypt.hash(password, saltRounds)];
            });
        });
    };
    AuthService.verifyPassword = function (password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, bcrypt.compare(password, hashedPassword)];
            });
        });
    };
    AuthService.register = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, hashedPassword, newUser, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage.getUserByEmail(userData.email)];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser) {
                            throw new Error('Un utilisateur avec cet email existe déjà');
                        }
                        return [4 /*yield*/, this.hashPassword(userData.password)];
                    case 2:
                        hashedPassword = _a.sent();
                        newUser = {
                            email: userData.email,
                            password: hashedPassword,
                            firstName: userData.firstName || null,
                            lastName: userData.lastName || null,
                            role: userData.role || 'patient',
                        };
                        return [4 /*yield*/, storage.createUser(newUser)];
                    case 3:
                        user = _a.sent();
                        return [2 /*return*/, {
                                id: user.id,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                role: user.role,
                            }];
                }
            });
        });
    };
    AuthService.login = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isValidPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage.getUserByEmail(email)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('Email ou mot de passe incorrect');
                        }
                        return [4 /*yield*/, this.verifyPassword(password, user.password)];
                    case 2:
                        isValidPassword = _a.sent();
                        if (!isValidPassword) {
                            throw new Error('Email ou mot de passe incorrect');
                        }
                        // Vérifier si l'utilisateur est actif
                        if (!user.isActive) {
                            throw new Error('Compte désactivé');
                        }
                        return [2 /*return*/, {
                                id: user.id,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                role: user.role,
                            }];
                }
            });
        });
    };
    AuthService.getUserById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage.getUser(id)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, {
                                id: user.id,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                role: user.role,
                            }];
                }
            });
        });
    };
    AuthService.updateUser = function (userId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var user, existing, updatedUser;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, storage.getUser(userId)];
                    case 1:
                        user = _d.sent();
                        if (!user) {
                            throw new Error("Utilisateur non trouvé");
                        }
                        if (!(data.email && data.email !== user.email)) return [3 /*break*/, 3];
                        return [4 /*yield*/, storage.getUserByEmail(data.email)];
                    case 2:
                        existing = _d.sent();
                        if (existing) {
                            throw new Error("Cet email est déjà utilisé par un autre compte.");
                        }
                        _d.label = 3;
                    case 3: return [4 /*yield*/, storage.updateUser(userId, {
                            firstName: (_a = data.firstName) !== null && _a !== void 0 ? _a : user.firstName,
                            lastName: (_b = data.lastName) !== null && _b !== void 0 ? _b : user.lastName,
                            email: (_c = data.email) !== null && _c !== void 0 ? _c : user.email,
                        })];
                    case 4:
                        updatedUser = _d.sent();
                        return [2 /*return*/, {
                                id: updatedUser.id,
                                email: updatedUser.email,
                                firstName: updatedUser.firstName,
                                lastName: updatedUser.lastName,
                                role: updatedUser.role,
                            }];
                }
            });
        });
    };
    AuthService.updatePassword = function (userId, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isMatch, hashedNewPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!oldPassword || !newPassword) {
                            throw new Error("L'ancien et le nouveau mot de passe sont requis.");
                        }
                        if (newPassword.length < 6) {
                            throw new Error("Le nouveau mot de passe doit contenir au moins 6 caractères.");
                        }
                        return [4 /*yield*/, storage.getUser(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error("Utilisateur non trouvé.");
                        }
                        return [4 /*yield*/, this.verifyPassword(oldPassword, user.password)];
                    case 2:
                        isMatch = _a.sent();
                        if (!isMatch) {
                            throw new Error("L'ancien mot de passe est incorrect.");
                        }
                        return [4 /*yield*/, this.hashPassword(newPassword)];
                    case 3:
                        hashedNewPassword = _a.sent();
                        return [4 /*yield*/, storage.updatePassword(userId, hashedNewPassword)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AuthService;
}());
export { AuthService };
// Middleware pour vérifier l'authentification
export function requireAuth(req, res, next) {
    var _a;
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.user)) {
        return res.status(401).json({ message: 'Authentification requise' });
    }
    next();
}
// Middleware pour vérifier le rôle admin
export function requireAdmin(req, res, next) {
    var _a;
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.user)) {
        return res.status(401).json({ message: 'Authentification requise' });
    }
    if (req.session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès administrateur requis' });
    }
    next();
}
