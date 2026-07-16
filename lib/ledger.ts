import crypto from "crypto";
import { dbService, ConsentLedgerEntry } from "./db";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

// Solana devnet connection
const SOLANA_RPC_URL = "https://api.devnet.solana.com";

/**
 * Computes the SHA-256 hash for a block in the consent ledger.
 * Format: SHA-256(prevHash + JSON.stringify({eventType, consentId, timestamp, payload})).
 */
export function computeBlockHash(
  prevHash: string,
  data: {
    eventType: string;
    consentId: string;
    timestamp: string;
    payload: any;
  }
): string {
  const input = prevHash + JSON.stringify({
    eventType: data.eventType,
    consentId: data.consentId,
    timestamp: data.timestamp,
    payload: data.payload,
  });

  return crypto.createHash("sha256").update(input).digest("hex");
}

/**
 * Submits a SHA-256 hash to the Solana devnet as a Memo transaction.
 * Returns the transaction signature, or undefined if not configured / failed.
 */
export async function submitHashToSolana(thisHash: string): Promise<string | undefined> {
  const privateKeyString = process.env.SOLANA_PRIVATE_KEY;
  if (!privateKeyString) {
    console.warn("[Solana] SOLANA_PRIVATE_KEY not set. Skipping real devnet memo submission.");
    return `simulated_solana_signature_${crypto.randomBytes(8).toString("hex")}`;
  }

  try {
    let secretKey: Uint8Array;
    if (privateKeyString.trim().startsWith("[")) {
      secretKey = new Uint8Array(JSON.parse(privateKeyString));
    } else {
      secretKey = new Uint8Array(privateKeyString.split(",").map(Number));
    }

    const keypair = Keypair.fromSecretKey(secretKey);
    const connection = new Connection(SOLANA_RPC_URL, "confirmed");

    // Memo program ID on Solana
    const MEMO_PROGRAM_ID = new PublicKey("Memorig1111111111111111111111111111111111");

    const memoInstruction = new TransactionInstruction({
      keys: [],
      programId: MEMO_PROGRAM_ID,
      data: Buffer.from(thisHash, "utf-8"),
    });

    const tx = new Transaction().add(memoInstruction);
    
    console.log(`[Solana] Submitting memo for hash ${thisHash.substring(0, 10)}... to devnet`);
    
    // We send and confirm the transaction.
    const signature = await sendAndConfirmTransaction(connection, tx, [keypair], {
      commitment: "confirmed",
      preflightCommitment: "confirmed",
    });

    console.log(`[Solana] Successfully wrote memo! Signature: ${signature}`);
    return signature;
  } catch (error: any) {
    console.error("[Solana] Devnet memo submission failed:", error.message || error);
    // Return a mock signature but flag it in the log for debugging
    return `failed_solana_devnet_tx_insufficient_funds_${crypto.randomBytes(4).toString("hex")}`;
  }
}

/**
 * Appends a new entry to the consent ledger chain.
 */
export async function appendLedgerEntry(
  consentId: string,
  eventType: "GRANT" | "SCOPE_CHANGE" | "REVOKE" | "BANK_ACCESS",
  payload: any
): Promise<ConsentLedgerEntry> {
  // Retrieve the latest ledger entry for this consent chain to get the previous hash
  const latestEntry = await dbService.getLatestLedgerEntry(consentId);
  const prevHash = latestEntry ? latestEntry.thisHash : "0".repeat(64);
  
  const timestamp = new Date().toISOString();
  const id = `block_${crypto.randomBytes(8).toString("hex")}`;
  const payloadHash = crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");

  const thisHash = computeBlockHash(prevHash, {
    eventType,
    consentId,
    timestamp,
    payload,
  });

  // Submit the block hash to Solana devnet
  const solanaTxSignature = await submitHashToSolana(thisHash);

  const entry: ConsentLedgerEntry = {
    id,
    consentId,
    eventType,
    timestamp,
    payloadHash,
    prevHash,
    thisHash,
    solanaTxSignature,
    // Add raw payload for verification (saved under a local property)
    ...({ payload } as any)
  };

  await dbService.createLedgerEntry(entry);
  return entry;
}

export interface VerificationResult {
  entry: ConsentLedgerEntry;
  verified: boolean;
  reason: string;
}

/**
 * Re-verifies all blocks for a given consentId.
 * Cross-checks with Solana devnet if RPC is accessible and signature is valid.
 */
export async function verifyLedgerChain(
  consentId: string,
  crossCheckSolana = false
): Promise<VerificationResult[]> {
  const entries = await dbService.listLedgerEntries(consentId);
  // Sort chronologically
  const sorted = [...entries].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  let expectedPrevHash = "0".repeat(64);
  const results: VerificationResult[] = [];

  const connection = crossCheckSolana ? new Connection(SOLANA_RPC_URL, "confirmed") : null;

  for (const entry of sorted) {
    const payload = (entry as any).payload || {};
    
    // 1. Recompute SHA-256 block hash
    const computedHash = computeBlockHash(entry.prevHash, {
      eventType: entry.eventType,
      consentId: entry.consentId,
      timestamp: entry.timestamp,
      payload,
    });

    const isThisHashValid = computedHash === entry.thisHash;
    const isPrevHashMatching = entry.prevHash === expectedPrevHash;
    
    let isSolanaValid = true;
    let solanaReason = "";

    // 2. Optional Solana Devnet Memo verification
    if (crossCheckSolana && connection && entry.solanaTxSignature) {
      if (
        entry.solanaTxSignature.startsWith("simulated_solana_signature") ||
        entry.solanaTxSignature.startsWith("failed_solana_devnet")
      ) {
        isSolanaValid = false;
        solanaReason = "Solana memo is simulated (no keys loaded in environment).";
      } else {
        try {
          const txDetails = await connection.getTransaction(entry.solanaTxSignature, {
            commitment: "confirmed",
            maxSupportedTransactionVersion: 0,
          });

          if (!txDetails) {
            isSolanaValid = false;
            solanaReason = `Transaction signature ${entry.solanaTxSignature} not found on Solana devnet.`;
          } else {
            // Check logs to confirm memo contains the thisHash
            const logs = txDetails.meta?.logMessages || [];
            const memoFound = logs.some((log) => log.includes(entry.thisHash));
            
            if (!memoFound) {
              isSolanaValid = false;
              solanaReason = `Solana transaction logs do not contain matching block hash: ${entry.thisHash}`;
            }
          }
        } catch (err: any) {
          isSolanaValid = false;
          solanaReason = `Failed to query Solana Devnet RPC: ${err.message || err}`;
        }
      }
    }

    const verified = isThisHashValid && isPrevHashMatching && isSolanaValid;
    let reason = "Block verified successfully.";
    if (!isThisHashValid) {
      reason = `Block hash mismatch. Computed: ${computedHash}, Stored: ${entry.thisHash}`;
    } else if (!isPrevHashMatching) {
      reason = `Previous hash pointer broken. Expected: ${expectedPrevHash}, Got: ${entry.prevHash}`;
    } else if (!isSolanaValid) {
      reason = `Solana Devnet cross-check failed: ${solanaReason}`;
    }

    results.push({
      entry,
      verified,
      reason,
    });

    // Advance expected pointer
    expectedPrevHash = computedHash;
  }

  return results;
}
