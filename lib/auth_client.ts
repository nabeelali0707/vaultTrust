import { auth } from "./firebase";

/**
 * Gets the current authenticated Firebase user's ID token.
 * Returns null if Firebase Auth is not configured or no user is signed in.
 */
export async function getClientAuthToken(): Promise<string | null> {
  if (auth && auth.currentUser) {
    try {
      return await auth.currentUser.getIdToken(true);
    } catch (e) {
      console.error("[Auth Client] Error getting ID token:", e);
      return null;
    }
  }
  return null;
}
