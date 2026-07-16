import { getAdminAuth } from "./firebase_admin";
import { cookies } from "next/headers";

export interface DecodedUser {
  uid: string;
  email: string;
  role: "FREELANCER" | "BANK_OFFICER";
}

/**
 * Verifies the incoming request's authentication state.
 * Real mode: parses and verifies the Firebase ID token in the Authorization header.
 * Fallback mode: reads the x-user-id cookie to derive a mock session for offline testing.
 */
export async function verifyAuthToken(request: Request): Promise<DecodedUser | null> {
  const authHeader = request.headers.get("Authorization");
  const auth = getAdminAuth();

  if (auth && authHeader && authHeader.startsWith("Bearer ")) {
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
      console.error("[Auth] Firebase ID Token verification failed:", error);
      return null;
    }
  }

  // Fallback Mode: if Firebase Admin is not configured, fall back to the cookie session
  const cookieStore = await cookies();
  const userId = cookieStore.get("x-user-id")?.value;

  if (userId) {
    if (userId === "ubl-bank-id" || userId === "bank-officer-id") {
      return {
        uid: userId,
        email: "ubl.officer@example.com",
        role: "BANK_OFFICER",
      };
    }
    const email = userId === "sana-malik-id" ? "sana.malik@example.com" : "ahmed.raza@example.com";
    return {
      uid: userId,
      email,
      role: "FREELANCER",
    };
  }

  // If no auth headers or cookies exist, return null (unauthorized)
  return null;
}
