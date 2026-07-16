import { auth } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";

/**
 * Helper promise that resolves when Firebase Auth is initialized and the first auth state check completes.
 */
export function waitForAuthInit(): Promise<User | null> {
  if (!auth) return Promise.resolve(null);

  return new Promise((resolve) => {
    // If the currentUser is already loaded, resolve immediately
    if (auth.currentUser) {
      resolve(auth.currentUser);
      return;
    }

    // Set up a one-time listener to capture the restored authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

/**
 * Gets the current authenticated Firebase user's ID token.
 * Waits for the SDK state to recover if it's currently null on initial mount.
 */
export async function getClientAuthToken(): Promise<string | null> {
  if (!auth) return null;

  let user = auth.currentUser;
  if (!user) {
    user = await waitForAuthInit();
  }

  if (user) {
    try {
      return await user.getIdToken();
    } catch (e) {
      console.error("[Auth Client] Error getting ID token:", e);
      return null;
    }
  }
  return null;
}
