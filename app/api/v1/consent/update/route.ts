import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { verifyAuthToken } from "@/lib/auth_helper";
import { appendLedgerEntry } from "@/lib/ledger";
import { z } from "zod";

const UpdateConsentSchema = z.object({
  consentId: z.string().optional(),
  sources: z.array(z.enum(["PAYONEER", "BANK_TRANSFER", "LOCAL_INVOICING"])),
  scope: z.string().min(1),
  duration: z.enum(["ONE_TIME", "ROLLING_6MO"]),
  purpose: z.string().min(1),
  bankId: z.string().optional(),
});

export async function PUT(request: Request) {
  try {
    const authUser = await verifyAuthToken(request);
    if (!authUser || authUser.role !== "FREELANCER") {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Freelancer role required" },
        { status: 401 }
      );
    }

    const userId = authUser.uid;
    const body = await request.json();
    const validated = UpdateConsentSchema.parse(body);

    let consent = null;
    if (validated.consentId) {
      consent = await dbService.getConsent(validated.consentId);
    } else {
      const bankId = validated.bankId || "ubl-bank-id";
      consent = await dbService.getConsent(`${userId}_${bankId}`);
    }

    if (!consent || consent.freelancerId !== userId) {
      return NextResponse.json(
        { success: false, error: "Consent policy not found." },
        { status: 404 }
      );
    }

    if (consent.status === "REVOKED") {
      return NextResponse.json(
        { success: false, error: "Cannot update a revoked consent policy." },
        { status: 400 }
      );
    }

    // Update the consent fields
    const updatedFields = {
      sources: validated.sources,
      scope: validated.scope,
      duration: validated.duration,
      purpose: validated.purpose,
    };
    await dbService.updateConsent(consent.id, updatedFields);

    // Append SCOPE_CHANGE to the ledger
    const ledgerEntry = await appendLedgerEntry(consent.id, "SCOPE_CHANGE", {
      oldSources: consent.sources,
      oldScope: consent.scope,
      oldDuration: consent.duration,
      oldPurpose: consent.purpose,
      newSources: validated.sources,
      newScope: validated.scope,
      newDuration: validated.duration,
      newPurpose: validated.purpose,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      consent: { ...consent, ...updatedFields },
      ledgerEntry,
      message: "Consent scope updated and recorded in ledger.",
    });
  } catch (error: any) {
    console.error("Update consent API endpoint error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
