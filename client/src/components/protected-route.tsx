import { useAuthQuery } from "@/hooks/use-auth.ts";
import { Redirect } from "wouter";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: user, isLoading, error } = useAuthQuery();

  if (isLoading) {
    // You can render a loading spinner here
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If there's an error or no user, redirect to login
  if (error || !user) {
    // User is not authenticated, redirect to login
    return <Redirect to="/login" />;
  }

  // User is authenticated, render the requested page
  return <>{children}</>;
}
