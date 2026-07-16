import { getClientAuthToken } from "./auth_client";

/**
 * Fetch wrapper that automatically appends the Firebase ID token
 * as a Bearer token in the Authorization header, if available.
 * Redirects the client to `/login` if no token is found or a 401 is received.
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getClientAuthToken();
  
  // If no user is authenticated, redirect to login
  if (!token && typeof window !== "undefined") {
    const path = window.location.pathname;
    if (path !== "/login" && path !== "/signup" && path !== "/") {
      window.location.href = "/login";
      // Return a pending promise to prevent downstream code execution
      return new Promise(() => {});
    }
  }

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  const res = await fetch(url, {
    ...options,
    headers,
  });

  // Intercept 401 Unauthorized server responses
  if (res.status === 401 && typeof window !== "undefined") {
    const path = window.location.pathname;
    if (path !== "/login" && path !== "/signup" && path !== "/") {
      window.location.href = "/login";
      return new Promise(() => {});
    }
  }

  return res;
}
