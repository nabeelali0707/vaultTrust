import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { verifyAuthToken } from "@/lib/auth_helper";
import { normalizeAmountToPKR } from "@/lib/scoring";

/**
 * GET /api/v1/connectors/summary
 * Returns a full aggregated summary for the authenticated freelancer:
 * - All connected sources with status
 * - Recent transactions (last 10 across all CONNECTED sources)
 * - 6-month monthly aggregates broken down by source type (in PKR)
 * - Source mix percentages (PAYONEER / BANK_TRANSFER / LOCAL_INVOICING)
 * - Current IVS score and eligibility band
 */
export async function GET(request: Request) {
  try {
    const authUser = await verifyAuthToken(request);
    if (!authUser || authUser.role !== "FREELANCER") {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Freelancer token required" },
        { status: 401 }
      );
    }

    const userId = authUser.uid;

    // Fetch connected sources, transactions, and persisted income score in parallel
    const [allSources, transactions, incomeScore] = await Promise.all([
      dbService.listConnectedSources(userId),
      dbService.listTransactions(userId),
      dbService.getIncomeScore(userId),
    ]);

    // Filter transactions to only those belonging to CONNECTED sources
    const connectedSourceIds = new Set(
      allSources.filter((s) => s.status === "CONNECTED").map((s) => s.id)
    );
    const activeTransactions = transactions.filter((t) =>
      connectedSourceIds.has(t.sourceId)
    );

    // Sort transactions by date descending for the recent list
    const recentTransactions = [...activeTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10); // Limit to latest 10

    // Build 6-month monthly aggregate buckets (oldest → current)
    const now = new Date();
    const monthlyAggregates = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 15);
      return {
        monthLabel: d.toLocaleString("default", { month: "short" }).toUpperCase(),
        year: d.getFullYear(),
        month: d.getMonth(),
        totalPKR: 0,
        payoneerPKR: 0,
        bankPKR: 0,
        invoicePKR: 0,
      };
    });

    activeTransactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      const txYear = txDate.getFullYear();
      const txMonth = txDate.getMonth();
      const amountPKR = normalizeAmountToPKR(tx.amount, tx.currency);

      const monthIdx = monthlyAggregates.findIndex(
        (m) => m.year === txYear && m.month === txMonth
      );

      if (monthIdx >= 0 && monthIdx < 6) {
        monthlyAggregates[monthIdx].totalPKR += amountPKR;

        const platform = allSources.find((s) => s.id === tx.sourceId)?.platform;
        if (platform === "PAYONEER") {
          monthlyAggregates[monthIdx].payoneerPKR += amountPKR;
        } else if (platform === "BANK_TRANSFER") {
          monthlyAggregates[monthIdx].bankPKR += amountPKR;
        } else if (platform === "LOCAL_INVOICING") {
          monthlyAggregates[monthIdx].invoicePKR += amountPKR;
        }
      }
    });

    // Compute source mix percentages normalized to PKR across all 6 months
    let totalAllMonthsPKR = 0;
    let payoneerTotal = 0;
    let bankTotal = 0;
    let invoiceTotal = 0;

    monthlyAggregates.forEach((m) => {
      totalAllMonthsPKR += m.totalPKR;
      payoneerTotal += m.payoneerPKR;
      bankTotal += m.bankPKR;
      invoiceTotal += m.invoicePKR;
    });

    const sourceMix = {
      payoneerPercent:
        totalAllMonthsPKR > 0
          ? Math.round((payoneerTotal / totalAllMonthsPKR) * 100)
          : 0,
      bankPercent:
        totalAllMonthsPKR > 0
          ? Math.round((bankTotal / totalAllMonthsPKR) * 100)
          : 0,
      invoicePercent:
        totalAllMonthsPKR > 0
          ? Math.round((invoiceTotal / totalAllMonthsPKR) * 100)
          : 0,
    };

    const currentMonthAgg = monthlyAggregates[5]; // Most recent month bucket
    const totalTransactions = activeTransactions.length;

    return NextResponse.json({
      success: true,
      userId,
      connectedSources: allSources,
      recentTransactions,
      monthlyAggregates: monthlyAggregates.map((m) => ({
        ...m,
        totalPKR: Math.round(m.totalPKR),
        payoneerPKR: Math.round(m.payoneerPKR),
        bankPKR: Math.round(m.bankPKR),
        invoicePKR: Math.round(m.invoicePKR),
      })),
      sourceMix,
      incomeScore: incomeScore
        ? {
            ivs: incomeScore.ivs,
            avgMonthlyIncome: incomeScore.avgMonthlyIncome,
            trend: incomeScore.trend,
            sourceDiversityScore: incomeScore.sourceDiversityScore,
            eligibilityBandPKR: incomeScore.eligibilityBandPKR,
            computedAt: incomeScore.computedAt,
          }
        : null,
      currentMonthTotalPKR: currentMonthAgg
        ? Math.round(currentMonthAgg.totalPKR)
        : 0,
      totalTransactions,
    });
  } catch (error: any) {
    console.error("[Summary GET] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
