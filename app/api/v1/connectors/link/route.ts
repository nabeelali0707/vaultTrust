import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { verifyAuthToken } from "@/lib/auth_helper";
import { getPlatformAdapter } from "@/lib/adapters";
import { computeIncomeScore } from "@/lib/scoring";
import { z } from "zod";

const linkSchema = z.object({
  platform: z.enum(["PAYONEER", "BANK_TRANSFER", "LOCAL_INVOICING"]),
  authCode: z.string().optional(),
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

    const body = await request.json();
    const validated = linkSchema.parse(body);

    // 1. Resolve adapter based on environment credentials
    const adapter = getPlatformAdapter(validated.platform);

    // 2. Perform connection handshake
    const source = await adapter.connect(authUser.uid, validated.platform, validated.authCode);
    await dbService.createConnectedSource(source);

    // 3. Fetch historical transactions using the adapter
    const transactions = await adapter.fetchTransactions(authUser.uid, source.id, validated.platform);
    await dbService.bulkCreateTransactions(authUser.uid, source.id, transactions);

    // 4. Retrieve all transactions to dynamically recompute Trust Score
    const allTransactions = await dbService.listTransactions(authUser.uid);
    const scores = computeIncomeScore(allTransactions);

    await dbService.upsertIncomeScore({
      freelancerId: authUser.uid,
      avgMonthlyIncome: scores.avgMonthlyIncome,
      coefficientOfVariation: scores.coefficientOfVariation,
      trend: scores.trend,
      sourceDiversityScore: scores.sourceDiversityScore,
      ivs: scores.ivs,
      eligibilityBandPKR: scores.eligibilityBandPKR,
      computedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      source,
      message: `${validated.platform} linked and transactions populated successfully.`,
    });
  } catch (error: any) {
    console.error("Link source endpoint error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 });
    }
    if (error.message && error.message.startsWith("NOT_CONFIGURED")) {
      return NextResponse.json({ success: false, error: error.message }, { status: 501 });
    }
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
