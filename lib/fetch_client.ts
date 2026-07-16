import { getClientAuthToken } from "./auth_client";

/**
 * Fetch wrapper that automatically appends the Firebase ID token
 * as a Bearer token in the Authorization header, if available.
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getClientAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  return fetch(url, {
    ...options,
    headers,
  });
}
