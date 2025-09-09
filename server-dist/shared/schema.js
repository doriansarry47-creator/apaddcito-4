var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
// Users table
export var users = pgTable("users", {
    id: varchar("id").primaryKey().default(sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    email: varchar("email").unique().notNull(),
    password: varchar("password").notNull(),
    firstName: varchar("first_name"),
    lastName: varchar("last_name"),
    profileImageUrl: varchar("profile_image_url"),
    role: varchar("role").default("patient"), // 'patient' or 'admin'
    level: integer("level").default(1),
    points: integer("points").default(0),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Exercises table
export var exercises = pgTable("exercises", {
    id: varchar("id").primaryKey().default(sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    title: varchar("title").notNull(),
    description: text("description"),
    category: varchar("category").notNull(), // 'cardio', 'strength', 'flexibility', 'mindfulness'
    difficulty: varchar("difficulty").default("beginner"), // 'beginner', 'intermediate', 'advanced'
    duration: integer("duration"), // in minutes
    instructions: text("instructions"),
    benefits: text("benefits"),
    imageUrl: varchar("image_url"),
    videoUrl: varchar("video_url"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Psychoeducation content table
export var psychoEducationContent = pgTable("psycho_education_content", {
    id: varchar("id").primaryKey().default(sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    title: varchar("title").notNull(),
    content: text("content").notNull(),
    category: varchar("category").notNull(), // 'addiction', 'motivation', 'coping', 'relapse_prevention'
    type: varchar("type").default("article"), // 'article', 'video', 'audio', 'interactive'
    difficulty: varchar("difficulty").default("beginner"),
    estimatedReadTime: integer("estimated_read_time"), // in minutes
    imageUrl: varchar("image_url"),
    videoUrl: varchar("video_url"),
    audioUrl: varchar("audio_url"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Craving entries
export var cravingEntries = pgTable("craving_entries", {
    id: varchar("id").primaryKey().default(sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    userId: varchar("user_id").notNull().references(function () { return users.id; }, { onDelete: 'cascade' }),
    intensity: integer("intensity").notNull(), // 0-10 scale
    triggers: jsonb("triggers").$type().default([]),
    emotions: jsonb("emotions").$type().default([]),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
});
// Exercise sessions
export var exerciseSessions = pgTable("exercise_sessions", {
    id: varchar("id").primaryKey().default(sql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    userId: varchar("user_id").notNull().references(function () { return users.id; }, { onDelete: 'cascade' }),
    exerciseId: varchar("exercise_id").notNull().references(function () { return exercises.id; }, { onDelete: 'cascade' }),
    duration: integer("duration"), // in seconds
    completed: boolean("completed").default(false),
    cratingBefore: integer("craving_before"), // 0-10 scale
    cravingAfter: integer("craving_after"), // 0-10 scale
    createdAt: timestamp("created_at").defaultNow(),
});
// Beck column analyses
export var beckAnalyses = pgTable("beck_analyses", {
    id: varchar("id").primaryKey().default(sql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    userId: varchar("user_id").notNull().references(function () { return users.id; }, { onDelete: 'cascade' }),
    situation: text("situation"),
    automaticThoughts: text("automatic_thoughts"),
    emotions: text("emotions"),
    emotionIntensity: integer("emotion_intensity"),
    rationalResponse: text("rational_response"),
    newFeeling: text("new_feeling"),
    newIntensity: integer("new_intensity"),
    createdAt: timestamp("created_at").defaultNow(),
});
// User badges
export var userBadges = pgTable("user_badges", {
    id: varchar("id").primaryKey().default(sql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    userId: varchar("user_id").notNull().references(function () { return users.id; }, { onDelete: 'cascade' }),
    badgeType: varchar("badge_type").notNull(), // '7_days', '50_exercises', 'craving_reduction'
    earnedAt: timestamp("earned_at").defaultNow(),
});
// User progress/stats
export var userStats = pgTable("user_stats", {
    id: varchar("id").primaryKey().default(sql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    userId: varchar("user_id").notNull().unique().references(function () { return users.id; }, { onDelete: 'cascade' }),
    exercisesCompleted: integer("exercises_completed").default(0),
    totalDuration: integer("total_duration").default(0), // in seconds
    currentStreak: integer("current_streak").default(0),
    longestStreak: integer("longest_streak").default(0),
    averageCraving: integer("average_craving"), // calculated average
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Create insert schemas
export var insertUserSchema = createInsertSchema(users).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export var insertExerciseSchema = createInsertSchema(exercises).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export var insertPsychoEducationContentSchema = createInsertSchema(psychoEducationContent).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export var insertCravingEntrySchema = createInsertSchema(cravingEntries).omit({
    id: true,
    createdAt: true,
});
export var insertExerciseSessionSchema = createInsertSchema(exerciseSessions).omit({
    id: true,
    createdAt: true,
});
export var insertBeckAnalysisSchema = createInsertSchema(beckAnalyses).omit({
    id: true,
    createdAt: true,
});
export var insertUserBadgeSchema = createInsertSchema(userBadges).omit({
    id: true,
    earnedAt: true,
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
