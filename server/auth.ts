import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { getDb } from './db.js';
import { users } from '@shared/schema.js';
import type { User } from '@shared/schema.js';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const db = getDb();
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  static async createUser(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  }): Promise<User> {
    try {
      const db = getDb();
      const hashedPassword = await this.hashPassword(userData.password);
      
      const result = await db.insert(users).values({
        ...userData,
        password: hashedPassword,
      }).returning();
      
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const db = getDb();
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }
}

// Middleware functions
export function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

export function requireAdmin(req: any, res: any, next: any) {
  if (!req.session?.userId || req.session?.userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}