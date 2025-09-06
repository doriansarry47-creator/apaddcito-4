import bcrypt from 'bcryptjs';
import { storage } from './storage.js';
import type { InsertUser, User } from '../shared/schema.js';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static async register(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  }): Promise<AuthUser> {
    // Enhanced validation
    if (!userData.email?.trim() || !userData.password?.trim()) {
      throw new Error('Email et mot de passe requis');
    }

    if (userData.password.length < 6) {
      throw new Error('Le mot de passe doit contenir au moins 6 caractères');
    }

    const email = userData.email.trim();
    console.log(`📝 Registration attempt for: ${email}`);

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      console.warn(`❌ Registration failed: Email already exists for ${email}`);
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    // Hacher le mot de passe
    const hashedPassword = await this.hashPassword(userData.password);

    // Créer l'utilisateur
    const newUser: InsertUser = {
      email,
      password: hashedPassword,
      firstName: userData.firstName?.trim() || null,
      lastName: userData.lastName?.trim() || null,
      role: userData.role || 'patient',
    };

    const user = await storage.createUser(newUser);
    
    console.log(`✅ Registration successful for: ${email}`);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  static async login(email: string, password: string): Promise<AuthUser> {
    // Enhanced validation
    if (!email?.trim() || !password?.trim()) {
      throw new Error('Email et mot de passe requis');
    }

    console.log(`🔐 Login attempt for: ${email.trim()}`);

    // Trouver l'utilisateur par email
    const user = await storage.getUserByEmail(email.trim());
    if (!user) {
      console.warn(`❌ Login failed: User not found for ${email.trim()}`);
      throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isValidPassword = await this.verifyPassword(password, user.password);
    if (!isValidPassword) {
      console.warn(`❌ Login failed: Invalid password for ${email.trim()}`);
      throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      console.warn(`❌ Login failed: Inactive account for ${email.trim()}`);
      throw new Error('Compte désactivé');
    }

    console.log(`✅ Login successful for: ${email.trim()}`);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  static async getUserById(id: string): Promise<AuthUser | null> {
    const user = await storage.getUser(id);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  static async updateUser(userId: string, data: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }): Promise<AuthUser> {
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    if (data.email && data.email !== user.email) {
      const existing = await storage.getUserByEmail(data.email);
      if (existing) {
        throw new Error("Cet email est déjà utilisé par un autre compte.");
      }
    }

    const updatedUser = await storage.updateUser(userId, {
      firstName: data.firstName ?? user.firstName,
      lastName: data.lastName ?? user.lastName,
      email: data.email ?? user.email,
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
    };
  }

  static async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    if (!oldPassword || !newPassword) {
      throw new Error("L'ancien et le nouveau mot de passe sont requis.");
    }
    if (newPassword.length < 6) {
      throw new Error("Le nouveau mot de passe doit contenir au moins 6 caractères.");
    }

    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé.");
    }

    const isMatch = await this.verifyPassword(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("L'ancien mot de passe est incorrect.");
    }

    const hashedNewPassword = await this.hashPassword(newPassword);
    await storage.updatePassword(userId, hashedNewPassword);
  }
}

// Middleware pour vérifier l'authentification
export function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.user) {
    console.warn(`❌ Unauthorized access attempt to ${req.path}`);
    return res.status(401).json({ 
      message: 'Authentification requise',
      code: 'AUTHENTICATION_REQUIRED'
    });
  }
  
  // Add user info to request for easier access
  req.user = req.session.user;
  next();
}

// Middleware pour vérifier le rôle admin
export function requireAdmin(req: any, res: any, next: any) {
  if (!req.session?.user) {
    console.warn(`❌ Unauthorized access attempt to admin route ${req.path}`);
    return res.status(401).json({ 
      message: 'Authentification requise',
      code: 'AUTHENTICATION_REQUIRED'
    });
  }
  
  if (req.session.user.role !== 'admin') {
    console.warn(`❌ Non-admin user ${req.session.user.email} attempted to access ${req.path}`);
    return res.status(403).json({ 
      message: 'Accès administrateur requis',
      code: 'ADMIN_ACCESS_REQUIRED'
    });
  }
  
  // Add user info to request for easier access
  req.user = req.session.user;
  next();
}

