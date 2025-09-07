
import { useState, useEffect, createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "@/lib/api";

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Authentication response interfaces
interface AuthResponse {
  user: User | null;
  message?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuthQuery() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const data = await api.get<AuthResponse>("/api/auth/me");
        return data?.user || null;
      } catch (error) {
        // Handle 401 (unauthorized) as not logged in
        if (error instanceof Error && 'status' in error && (error as ApiError).status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ email, password }: LoginRequest) => {
      // Enhanced validation
      if (!email?.trim()) {
        throw new Error("L'email est requis");
      }
      if (!password?.trim()) {
        throw new Error("Le mot de passe est requis");
      }
      
      const data = await api.post<AuthResponse>("/api/auth/login", { email: email.trim(), password });
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data?.user || null);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      // Enhanced validation
      if (!userData.email?.trim()) {
        throw new Error("L'email est requis");
      }
      if (!userData.password?.trim()) {
        throw new Error("Le mot de passe est requis");
      }
      if (userData.password.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères");
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email.trim())) {
        throw new Error("Format d'email invalide");
      }
      
      const data = await api.post<AuthResponse>("/api/auth/register", {
        ...userData,
        email: userData.email.trim(),
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data?.user || null);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const data = await api.post<{ message: string }>("/api/auth/logout");
      return data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
    },
  });
}
