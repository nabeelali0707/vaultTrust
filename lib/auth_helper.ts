import { getAdminAuth } from "./firebase_admin";

export interface DecodedUser {
  uid: string;
  email: string;
  role: "FREELANCER" | "BANK_OFFICER";
}

/**
 * Verifies the incoming request's authentication state.
 * Strictly checks for a valid Firebase ID Token in the Authorization header.
 * Returns null if the token is missing, invalid, or expired.
 */
export async function verifyAuthToken(request: Request): Promise<DecodedUser | null> {
  const authHeader = request.headers.get("Authorization");
  const auth = getAdminAuth();

  if (!auth) {
    throw new Error("Firebase Admin SDK is not initialized. Cannot verify tokens.");
  }

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const idToken = authHeader.substring(7);
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      const role = (decodedToken.role as "FREELANCER" | "BANK_OFFICER") || "FREELANCER";
      return {
        uid: decodedToken.uid,
        email: decodedToken.email || "",
        role: role,
      };
    } catch (error) {
      console.error("[Auth Helper] Firebase ID Token verification failed:", error);
      return null;
    }
  }

  return null;
}
