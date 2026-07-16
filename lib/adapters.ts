import { ConnectedSource, Transaction } from "./db";
import crypto from "crypto";

export interface PlatformAdapter {
  connect(
    uid: string,
    platform: "PAYONEER" | "BANK_TRANSFER" | "LOCAL_INVOICING",
    authCode?: string
  ): Promise<ConnectedSource>;
  
  fetchTransactions(
    freelancerId: string,
    sourceId: string,
    platform: "PAYONEER" | "BANK_TRANSFER" | "LOCAL_INVOICING"
  ): Promise<Transaction[]>;
}

/**
 * Sandbox Platform Adapter generating realistic 6-month transaction data.
 */
export class SandboxAdapter implements PlatformAdapter {
  async connect(
    uid: string,
    platform: "PAYONEER" | "BANK_TRANSFER" | "LOCAL_INVOICING",
    authCode?: string
  ): Promise<ConnectedSource> {
    const id = `${uid}_${platform.toLowerCase()}`;
    return {
      id,
      freelancerId: uid,
      platform,
      status: "CONNECTED",
      connectedAt: new Date().toISOString(),
      provider: "sandbox",
    };
  }

  async fetchTransactions(
    freelancerId: string,
    sourceId: string,
    platform: "PAYONEER" | "BANK_TRANSFER" | "LOCAL_INVOICING"
  ): Promise<Transaction[]> {
    const transactions: Transaction[] = [];
    const now = new Date();

    // Helper to generate transaction mock dates matching month offsets
    const getTxDate = (monthsAgo: number, day: number) => {
      const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, day);
      return d.toISOString();
    };

    // Generate 6 months of historical transactions (2-3 transactions per month)
    for (let month = 0; month < 6; month++) {
      if (platform === "PAYONEER") {
        // Freelance payments from Upwork/Fiverr (in USD)
        transactions.push({
          id: `tx_sb_pay_${month}_1`,
          sourceId,
          freelancerId,
          amount: 800 + Math.round(Math.random() * 400),
          currency: "USD",
          date: getTxDate(month, 5),
          clientLabel: "Upwork Escrow Disbursement",
        });
        transactions.push({
          id: `tx_sb_pay_${month}_2`,
          sourceId,
          freelancerId,
          amount: 450 + Math.round(Math.random() * 200),
          currency: "USD",
          date: getTxDate(month, 20),
          clientLabel: "Fiverr Ltd Payout",
        });
      } else if (platform === "BANK_TRANSFER") {
        // Direct local client wire transfers (in PKR)
        transactions.push({
          id: `tx_sb_bank_${month}_1`,
          sourceId,
          freelancerId,
          amount: 60000 + Math.round(Math.random() * 20000),
          currency: "PKR",
          date: getTxDate(month, 10),
          clientLabel: "Habib Bank IBFT Inward",
        });
        transactions.push({
          id: `tx_sb_bank_${month}_2`,
          sourceId,
          freelancerId,
          amount: 40000 + Math.round(Math.random() * 15000),
          currency: "PKR",
          date: getTxDate(month, 25),
          clientLabel: "SCB Pakistan Salary Inward",
        });
      } else if (platform === "LOCAL_INVOICING") {
        // Local client billing (in PKR)
        transactions.push({
          id: `tx_sb_inv_${month}_1`,
          sourceId,
          freelancerId,
          amount: 30000 + Math.round(Math.random() * 10000),
          currency: "PKR",
          date: getTxDate(month, 12),
          clientLabel: "Inv #2908 Tech Solutions",
        });
        transactions.push({
          id: `tx_sb_inv_${month}_2`,
          sourceId,
          freelancerId,
          amount: 25000 + Math.round(Math.random() * 10000),
          currency: "PKR",
          date: getTxDate(month, 27),
          clientLabel: "Inv #2909 Apex Design Studio",
        });
      }
    }

    return transactions;
  }
}

/**
 * Payoneer Live Adapter throwing error if credentials are not configured in environment.
 */
export class PayoneerLiveAdapter implements PlatformAdapter {
  private isConfigured(): boolean {
    return !!(
      process.env.PAYONEER_CLIENT_ID &&
      process.env.PAYONEER_CLIENT_SECRET &&
      process.env.PAYONEER_REDIRECT_URI
    );
  }

  async connect(
    uid: string,
    platform: "PAYONEER",
    authCode?: string
  ): Promise<ConnectedSource> {
    if (!this.isConfigured()) {
      throw new Error("NOT_CONFIGURED: Payoneer Live API credentials (PAYONEER_CLIENT_ID/SECRET) are missing in environment.");
    }
    const id = `${uid}_payoneer_live`;
    return {
      id,
      freelancerId: uid,
      platform: "PAYONEER",
      status: "CONNECTED",
      connectedAt: new Date().toISOString(),
      provider: "live",
    };
  }

  async fetchTransactions(
    freelancerId: string,
    sourceId: string,
    platform: "PAYONEER"
  ): Promise<Transaction[]> {
    if (!this.isConfigured()) {
      throw new Error("NOT_CONFIGURED: Payoneer Live API credentials are missing in environment.");
    }
    // Real OAuth API calls would go here
    return [];
  }
}

/**
 * Upwork Live Adapter throwing error if credentials are not configured in environment.
 */
export class UpworkLiveAdapter implements PlatformAdapter {
  private isConfigured(): boolean {
    return !!(
      process.env.UPWORK_CLIENT_ID &&
      process.env.UPWORK_CLIENT_SECRET
    );
  }

  async connect(
    uid: string,
    platform: "PAYONEER" | "BANK_TRANSFER" | "LOCAL_INVOICING",
    authCode?: string
  ): Promise<ConnectedSource> {
    if (!this.isConfigured()) {
      throw new Error("NOT_CONFIGURED: Upwork API credentials (UPWORK_CLIENT_ID/SECRET) are missing in environment.");
    }
    const id = `${uid}_upwork_live`;
    return {
      id,
      freelancerId: uid,
      platform,
      status: "CONNECTED",
      connectedAt: new Date().toISOString(),
      provider: "live",
    };
  }

  async fetchTransactions(
    freelancerId: string,
    sourceId: string,
    platform: "PAYONEER" | "BANK_TRANSFER" | "LOCAL_INVOICING"
  ): Promise<Transaction[]> {
    if (!this.isConfigured()) {
      throw new Error("NOT_CONFIGURED: Upwork API credentials are missing in environment.");
    }
    return [];
  }
}

/**
 * Factory to retrieve the active PlatformAdapter.
 * Automatically chooses sandbox vs live based on whether live environment variables exist.
 */
export function getPlatformAdapter(platform: "PAYONEER" | "BANK_TRANSFER" | "LOCAL_INVOICING"): PlatformAdapter {
  if (platform === "PAYONEER" && process.env.PAYONEER_CLIENT_ID) {
    return new PayoneerLiveAdapter();
  }
  // Otherwise, default to sandbox adapter
  return new SandboxAdapter();
}
