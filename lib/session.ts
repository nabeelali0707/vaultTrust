import { cookies } from "next/headers";

export async function getCurrentUserId(): Promise<string> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("x-user-id")?.value;
  // Default to primary freelancer for convenience during onboarding/initial load
  return userId || "ahmed-raza-id";
}
