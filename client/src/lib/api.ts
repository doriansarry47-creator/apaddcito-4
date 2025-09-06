/**
 * Centralized API fetch wrapper for robust authentication and error handling
 */

export interface ApiError extends Error {
  status: number;
  statusText: string;
}

export interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  credentials?: RequestCredentials;
}

/**
 * Safe JSON parsing with proper error handling
 */
async function safeJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Réponse du serveur invalide");
  }
}

/**
 * Create an API error with status information
 */
function createApiError(message: string, status: number, statusText: string): ApiError {
  const error = new Error(message) as ApiError;
  error.status = status;
  error.statusText = statusText;
  return error;
}

/**
 * Centralized API fetch wrapper
 * Handles authentication, JSON parsing, and error responses consistently
 */
export async function apiFetch<T = unknown>(
  url: string,
  options: ApiOptions = {}
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body,
    credentials = "include",
  } = options;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials,
    });

    const data = await safeJson(response);

    if (!response.ok) {
      const message = 
        (data as any)?.message || 
        response.statusText || 
        `HTTP ${response.status}`;
      
      throw createApiError(message, response.status, response.statusText);
    }

    return data as T;
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof Error && 'status' in error) {
      throw error;
    }
    
    // Handle network errors and other exceptions
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Erreur de connexion au serveur"
    );
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T = unknown>(url: string, options?: Omit<ApiOptions, 'method'>) =>
    apiFetch<T>(url, { ...options, method: "GET" }),
    
  post: <T = unknown>(url: string, body?: unknown, options?: Omit<ApiOptions, 'method' | 'body'>) =>
    apiFetch<T>(url, { ...options, method: "POST", body }),
    
  put: <T = unknown>(url: string, body?: unknown, options?: Omit<ApiOptions, 'method' | 'body'>) =>
    apiFetch<T>(url, { ...options, method: "PUT", body }),
    
  delete: <T = unknown>(url: string, options?: Omit<ApiOptions, 'method'>) =>
    apiFetch<T>(url, { ...options, method: "DELETE" }),
    
  patch: <T = unknown>(url: string, body?: unknown, options?: Omit<ApiOptions, 'method' | 'body'>) =>
    apiFetch<T>(url, { ...options, method: "PATCH", body }),
};