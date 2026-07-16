import { NextResponse } from "next/server";
import { dbService, Consent } from "@/lib/db";
import { verifyAuthToken } from "@/lib/auth_helper";
import { appendLedgerEntry } from "@/lib/ledger";
import { isRateLimited } from "@/lib/rate_limiter";
import { z } from "zod";

const GrantConsentSchema = z.object({
  sources: z.array(z.enum(["PAYONEER", "BANK_TRANSFER", "LOCAL_INVOICING"])),
  scope: z.string().optional().default("ALL"),
  duration: z.enum(["ONE_TIME", "ROLLING_6MO"]).optional(),
  scopeDuration: z.enum(["ONE_TIME", "ROLLING_6MO"]).optional(),
  purpose: z.string().min(1),
  bankId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const authUser = await verifyAuthToken(request);
    if (!authUser || authUser.role !== "FREELANCER") {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Freelancer role required" },
        { status: 401 }
      );
    }

    const userId = authUser.uid;

    // Rate limiting: 5 grant requests per minute per user
    if (isRateLimited(userId, 5, 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please wait a minute." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = GrantConsentSchema.parse(body);
    const { sources, scope, purpose, bankId } = validated;
    const finalDuration = validated.duration || validated.scopeDuration || "ROLLING_6MO";

    const consentId = `${userId}_${bankId}`;

    // 1. Check if there is an active consent, and revoke it first
    const activeConsent = await dbService.getActiveConsent(userId, bankId);
    if (activeConsent) {
      await dbService.updateConsent(activeConsent.id, {
        status: "REVOKED",
        revokedAt: new Date().toISOString(),
      });
      // Append REVOKE entry for the old policy
      await appendLedgerEntry(activeConsent.id, "REVOKE", {
        reason: "Superseded by new consent grant policy",
        revokedAt: new Date().toISOString(),
      });
    }

    // 2. Create the new Consent record
    const newConsent: Consent = {
      id: consentId,
      freelancerId: userId,
      bankId,
      sources,
      scope,
      duration: finalDuration,
      purpose,
      status: "ACTIVE",
      grantedAt: new Date().toISOString(),
      revokedAt: null,
    };

    await dbService.createConsent(newConsent);

    // 3. Append the GRANT entry to the ledger
    const ledgerEntry = await appendLedgerEntry(consentId, "GRANT", {
      sources,
      scope,
      duration: finalDuration,
      purpose,
      grantedAt: newConsent.grantedAt,
    });

    return NextResponse.json({
      success: true,
      consent: newConsent,
      ledgerEntry,
      message: "Secure consent granted and recorded in tamper-evident ledger.",
    });
  } catch (error: any) {
    console.error("Grant consent API endpoint error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
