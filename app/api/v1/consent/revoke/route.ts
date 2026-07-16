import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { verifyAuthToken } from "@/lib/auth_helper";
import { appendLedgerEntry } from "@/lib/ledger";
import { z } from "zod";

const RevokeConsentSchema = z.object({
  consentId: z.string().optional(),
  bankId: z.string().optional(),
});

async function handleRevocation(request: Request) {
  try {
    const authUser = await verifyAuthToken(request);
    if (!authUser || authUser.role !== "FREELANCER") {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Freelancer role required" },
        { status: 401 }
      );
    }

    const userId = authUser.uid;
    
    // Parse body or query params to find consentId or bankId
    let consentId: string | undefined;
    let bankId: string | undefined;

    const { searchParams } = new URL(request.url);
    consentId = searchParams.get("consentId") || undefined;
    bankId = searchParams.get("bankId") || undefined;

    if (!consentId) {
      try {
        const body = await request.json();
        const parsed = RevokeConsentSchema.safeParse(body);
        if (parsed.success) {
          consentId = parsed.data.consentId;
          bankId = parsed.data.bankId;
        }
      } catch (e) {
        // Body reading failed or empty, fallback to active search
      }
    }

    // Find the consent to revoke (by ID or find active one)
    let consent = null;
    if (consentId) {
      consent = await dbService.getConsent(consentId);
    } else {
      const activeBankId = bankId || "ubl-bank-id";
      consent = await dbService.getConsent(`${userId}_${activeBankId}`);
    }

    if (!consent || consent.freelancerId !== userId) {
      return NextResponse.json(
        { success: false, error: "Active consent policy not found." },
        { status: 404 }
      );
    }

    if (consent.status === "REVOKED") {
      return NextResponse.json({
        success: true,
        message: "Consent is already revoked.",
        consent,
      });
    }

    // Revoke the consent in the DB
    const revokedAt = new Date().toISOString();
    await dbService.updateConsent(consent.id, {
      status: "REVOKED",
      revokedAt,
    });

    // Append REVOKE to the ledger
    const ledgerEntry = await appendLedgerEntry(consent.id, "REVOKE", {
      reason: "Revoked by user",
      revokedAt,
    });

    return NextResponse.json({
      success: true,
      consent: { ...consent, status: "REVOKED", revokedAt },
      ledgerEntry,
      message: "Consent successfully revoked and recorded in ledger.",
    });
  } catch (error: any) {
    console.error("Revoke consent API endpoint error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return handleRevocation(request);
}

export async function DELETE(request: Request) {
  return handleRevocation(request);
}
