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
import { getDB } from "./db.js";
import { users, exercises, psychoEducationContent, cravingEntries, exerciseSessions, beckAnalyses, userBadges, userStats, } from "../shared/schema.js";
import { eq, desc, and, gte } from "drizzle-orm";
var DbStorage = /** @class */ (function () {
    function DbStorage() {
    }
    DbStorage.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getDB().select().from(users).where(eq(users.id, id)).then(function (rows) { return rows[0]; })];
            });
        });
    };
    DbStorage.prototype.getUserByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getDB().select().from(users).where(eq(users.email, email)).then(function (rows) { return rows[0]; })];
            });
        });
    };
    DbStorage.prototype.createUser = function (insertUser) {
        return __awaiter(this, void 0, void 0, function () {
            var newUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getDB().insert(users).values(insertUser).returning().then(function (rows) { return rows[0]; })];
                    case 1:
                        newUser = _a.sent();
                        // Initialize stats for the new user
                        return [4 /*yield*/, getDB().insert(userStats).values({ userId: newUser.id })];
                    case 2:
                        // Initialize stats for the new user
                        _a.sent();
                        return [2 /*return*/, newUser];
                }
            });
        });
    };
    DbStorage.prototype.updateUser = function (userId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getDB().update(users)
                            .set(__assign(__assign({}, data), { updatedAt: new Date() }))
                            .where(eq(users.id, userId))
                            .returning()];
                    case 1:
                        updatedUser = _a.sent();
                        return [2 /*return*/, updatedUser[0]];
                }
            });
        });
    };
    DbStorage.prototype.updatePassword = function (userId, newHashedPassword) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getDB().update(users)
                        .set({ password: newHashedPassword, updatedAt: new Date() })
                        .where(eq(users.id, userId))
                        .returning()
                        .then(function (rows) { return rows[0]; })];
            });
        });
    };
    DbStorage.prototype.deleteUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getDB().transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.delete(userBadges).where(eq(userBadges.userId, userId))];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, tx.delete(userStats).where(eq(userStats.userId, userId))];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, tx.delete(beckAnalyses).where(eq(beckAnalyses.userId, userId))];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, tx.delete(exerciseSessions).where(eq(exerciseSessions.userId, userId))];
                                    case 4:
                                        _a.sent();
                                        return [4 /*yield*/, tx.delete(cravingEntries).where(eq(cravingEntries.userId, userId))];
                                    case 5:
                                        _a.sent();
                                        return [4 /*yield*/, tx.delete(users).where(eq(users.id, userId))];
                                    case 6:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DbStorage.prototype.updateUserStats = function (userId, statsUpdate) {
        return __awaiter(this, void 0, void 0, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getDB().update(userStats)
                            .set(__assign(__assign({}, statsUpdate), { updatedAt: new Date() }))
                            .where(eq(userStats.userId, userId))
                            .returning()];
                    case 1:
                        updated = _a.sent();
                        return [2 /*return*/, updated[0]];
                }
            });
        });
    };
    DbStorage.prototype.getExercises = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getDB().select().from(exercises).where(eq(exercises.isActive, true)).orderBy(exercises.title)];
            });
        });
    };
    DbStorage.prototype.getAllExercises = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getDB().select().from(exercises).orderBy(exercises.title)];
            });
        });
    };
    DbStorage.prototype.createExercise = function (insertExercise) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getDB().insert(exercises).values(insertExercise).returning().then(function (rows) { return rows[0]; })];
            });
        });
    };
    DbStorage.prototype.getPsychoEducationContent = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getDB().select().from(psychoEducationContent).where(eq(psychoEducationContent.isActive, true)).orderBy(psychoEducationContent.title)];
            });
        });
    };
    DbStorage.prototype.getAllPsychoEducationContent = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getDB().select().from(psychoEducationContent).orderBy(psychoEducationContent.title)];
            });
        });
    };
    DbStorage.prototype.createPsychoEducationContent = function (insertContent) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getDB().insert(psychoEducationContent).values(insertContent).returning().then(function (rows) { return rows[0]; })];
            });
        });
    };
    DbStorage.prototype.createCravingEntry = function (insertEntry) {
        return __awaiter(this, void 0, void 0, function () {
            var valuesToInsert, newEntry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        valuesToInsert = {
                            userId: insertEntry.userId,
                            intensity: insertEntry.intensity,
                        };
                        if (insertEntry.triggers)
                            valuesToInsert.triggers = Array.from(insertEntry.triggers);
                        if (insertEntry.emotions)
                            valuesToInsert.emotions = Array.from(insertEntry.emotions);
                        if (insertEntry.notes)
                            valuesToInsert.notes = insertEntry.notes;
                        return [4 /*yield*/, getDB().insert(cravingEntries).values(valuesToInsert).returning().then(function (rows) { return rows[0]; })];
                    case 1:
                        newEntry = _a.sent();
                        return [4 /*yield*/, this.updateAverageCraving(insertEntry.userId)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, newEntry];
                }
            });
        });
    };
    DbStorage.prototype.getCravingEntries = function (userId_1) {
        return __awaiter(this, arguments, void 0, function (userId, limit) {
            if (limit === void 0) { limit = 50; }
            return __generator(this, function (_a) {
                return [2 /*return*/, getDB().select().from(cravingEntries)
                        .where(eq(cravingEntries.userId, userId))
                        .orderBy(desc(cravingEntries.createdAt))
                        .limit(limit)];
            });
        });
    };
    DbStorage.prototype.getCravingStats = function (userId_1) {
        return __awaiter(this, arguments, void 0, function (userId, days) {
            var cutoffDate, entries, average, midPoint, firstHalf, secondHalf, firstAvg, secondAvg, trend;
            if (days === void 0) { days = 30; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cutoffDate = new Date();
                        cutoffDate.setDate(cutoffDate.getDate() - days);
                        return [4 /*yield*/, getDB().select().from(cravingEntries)
                                .where(and(eq(cravingEntries.userId, userId), gte(cravingEntries.createdAt, cutoffDate)))
                                .orderBy(cravingEntries.createdAt)];
                    case 1:
                        entries = _a.sent();
                        if (entries.length === 0)
                            return [2 /*return*/, { average: 0, trend: 0 }];
                        average = entries.reduce(function (sum, entry) { return sum + entry.intensity; }, 0) / entries.length;
                        midPoint = Math.floor(entries.length / 2);
                        if (midPoint < 1)
                            return [2 /*return*/, { average: Math.round(average * 10) / 10, trend: 0 }];
                        firstHalf = entries.slice(0, midPoint);
                        secondHalf = entries.slice(midPoint);
                        firstAvg = firstHalf.reduce(function (sum, entry) { return sum + entry.intensity; }, 0) / firstHalf.length || 0;
                        secondAvg = secondHalf.reduce(function (sum, entry) { return sum + entry.intensity; }, 0) / secondHalf.length || 0;
                        trend = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0;
                        return [2 /*return*/, { average: Math.round(average * 10) / 10, trend: Math.round(trend) }];
                }
            });
        });
    };
    DbStorage.prototype.updateAverageCraving = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCravingStats(userId)];
                    case 1:
                        stats = _a.sent();
                        return [4 /*yield*/, this.updateUserStats(userId, { averageCraving: Math.round(stats.average) })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DbStorage.prototype.createExerciseSession = function (insertSession) {
        return __awaiter(this, void 0, void 0, function () {
            var session, currentStats, user, newPoints, newLevel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getDB().insert(exerciseSessions).values(insertSession).returning().then(function (rows) { return rows[0]; })];
                    case 1:
                        session = _a.sent();
                        if (!session.completed) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.getUserStats(session.userId)];
                    case 2:
                        currentStats = _a.sent();
                        if (!currentStats) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.updateUserStats(session.userId, {
                                exercisesCompleted: (currentStats.exercisesCompleted || 0) + 1,
                                totalDuration: (currentStats.totalDuration || 0) + (session.duration || 0),
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.getUser(session.userId)];
                    case 5:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 7];
                        newPoints = (user.points || 0) + 10;
                        newLevel = Math.floor(newPoints / 100) + 1;
                        return [4 /*yield*/, getDB().update(users).set({ points: newPoints, level: newLevel, updatedAt: new Date() }).where(eq(users.id, session.userId))];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [4 /*yield*/, this.checkAndAwardBadges(session.userId)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/, session];
                }
            });
        });
    };
    DbStorage.prototype.getExerciseSessions = function (userId_1) {
        return __awaiter(this, arguments, void 0, function (userId, limit) {
            if (limit === void 0) { limit = 50; }
            return __generator(this, function (_a) {
                return [2 /*return*/, getDB().select().from(exerciseSessions)
                        .where(eq(exerciseSessions.userId, userId))
                        .orderBy(desc(exerciseSessions.createdAt))
                        .limit(limit)];
            });
        });
    };
    DbStorage.prototype.getUserStats = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getDB().select().from(userStats).where(eq(userStats.userId, userId)).then(function (rows) { return rows[0]; })];
            });
        });
    };
    DbStorage.prototype.createBeckAnalysis = function (insertAnalysis) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getDB().insert(beckAnalyses).values(insertAnalysis).returning().then(function (rows) { return rows[0]; })];
            });
        });
    };
    DbStorage.prototype.getBeckAnalyses = function (userId_1) {
        return __awaiter(this, arguments, void 0, function (userId, limit) {
            if (limit === void 0) { limit = 20; }
            return __generator(this, function (_a) {
                return [2 /*return*/, getDB().select().from(beckAnalyses)
                        .where(eq(beckAnalyses.userId, userId))
                        .orderBy(desc(beckAnalyses.createdAt))
                        .limit(limit)];
            });
        });
    };
    DbStorage.prototype.getUserBadges = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getDB().select().from(userBadges).where(eq(userBadges.userId, userId)).orderBy(desc(userBadges.earnedAt))];
            });
        });
    };
    DbStorage.prototype.awardBadge = function (insertBadge) {
        return __awaiter(this, void 0, void 0, function () {
            var existingBadge;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getDB().select().from(userBadges)
                            .where(and(eq(userBadges.userId, insertBadge.userId), eq(userBadges.badgeType, insertBadge.badgeType)))
                            .then(function (rows) { return rows[0]; })];
                    case 1:
                        existingBadge = _a.sent();
                        if (existingBadge)
                            return [2 /*return*/, existingBadge];
                        return [2 /*return*/, getDB().insert(userBadges).values(insertBadge).returning().then(function (rows) { return rows[0]; })];
                }
            });
        });
    };
    DbStorage.prototype.checkAndAwardBadges = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var newBadges, stats, badge;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newBadges = [];
                        return [4 /*yield*/, this.getUserStats(userId)];
                    case 1:
                        stats = _a.sent();
                        if (!stats)
                            return [2 /*return*/, newBadges];
                        if (!((stats.exercisesCompleted || 0) >= 50)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.awardBadge({ userId: userId, badgeType: '50_exercises' })];
                    case 2:
                        badge = _a.sent();
                        if (badge)
                            newBadges.push(badge);
                        _a.label = 3;
                    case 3: 
                    // Other badge logic can be added here...
                    return [2 /*return*/, newBadges];
                }
            });
        });
    };
    return DbStorage;
}());
export { DbStorage };
export var storage = new DbStorage();
