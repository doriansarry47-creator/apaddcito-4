import { z } from 'zod';
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Database schema definitions
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
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

export const exercises = pgTable("exercises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  difficulty: varchar("difficulty").default("beginner"),
  duration: integer("duration"),
  instructions: text("instructions"),
  benefits: text("benefits"),
  imageUrl: varchar("image_url"),
  videoUrl: varchar("video_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod validation schemas
export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['patient', 'admin']).default('patient'),
});

export const ExerciseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  duration: z.number().min(1).optional(),
  instructions: z.string().optional(),
  benefits: z.string().optional(),
});

// TypeScript types
export type User = z.infer<typeof UserSchema>;
export type Exercise = z.infer<typeof ExerciseSchema>;
export type UserDB = typeof users.$inferSelect;
export type ExerciseDB = typeof exercises.$inferSelect;