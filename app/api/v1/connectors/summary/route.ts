import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { verifyAuthToken } from "@/lib/auth_helper";
import { normalizeAmountToPKR } from "@/lib/scoring";

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

    // Fetch connected sources and transactions from the nested subcollections
    const allSources = await dbService.listConnectedSources(userId);
    const transactions = await dbService.listTransactions(userId);

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

    // Group transactions by calendar month for the last 6 months (relative to now)
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

        // Breakdown by platform
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

    // Format totals nicely
    const currentMonthAgg = monthlyAggregates[5]; // Current month
    const totalTransactions = activeTransactions.length;

    // Calculate source percentages
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
      payoneerPercent: totalAllMonthsPKR > 0 ? Math.round((payoneerTotal / totalAllMonthsPKR) * 100) : 0,
      bankPercent: totalAllMonthsPKR > 0 ? Math.round((bankTotal / totalAllMonthsPKR) * 100) : 0,
      invoicePercent: totalAllMonthsPKR > 0 ? Math.round((invoiceTotal / totalAllMonthsPKR) * 100) : 0,
    };

    return NextResponse.json({
      success: true,
      userId,
      connectedSources: allSources,
      recentTransactions,
      monthlyAggregates,
      sourceMix,
      currentMonthTotalPKR: currentMonthAgg ? Math.round(currentMonthAgg.totalPKR) : 0,
      totalTransactions,
    });
  } catch (error: any) {
    console.error("Summary API endpoint error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
