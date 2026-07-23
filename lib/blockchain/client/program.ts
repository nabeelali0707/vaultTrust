import fs from "fs";
import path from "path";
import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair } from "@solana/web3.js";
import idl from "../idl/vault_trust.json";
import type { VaultTrust } from "../idl/vault_trust";
import { BlockchainError } from "../utils/errors";

let cachedProgram: anchor.Program<VaultTrust> | null = null;
let cachedServiceKeypair: Keypair | null = null;

function loadServiceKeypair(): Keypair {
  if (cachedServiceKeypair) return cachedServiceKeypair;

  const keypairPath = process.env.SOLANA_BACKEND_KEYPAIR;
  if (!keypairPath) {
    throw new BlockchainError(
      "WALLET_UNAVAILABLE",
      "Backend service wallet unavailable: missing environment variable SOLANA_BACKEND_KEYPAIR (path to the service wallet keypair JSON)."
    );
  }

  const resolvedPath = path.isAbsolute(keypairPath) ? keypairPath : path.join(process.cwd(), keypairPath);

  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(resolvedPath, "utf-8"));
  } catch (err) {
    throw new BlockchainError(
      "WALLET_UNAVAILABLE",
      `Backend service wallet unavailable: could not read/parse keypair file at "${resolvedPath}".`,
      { cause: err }
    );
  }

  try {
    cachedServiceKeypair = Keypair.fromSecretKey(new Uint8Array(raw as number[]));
  } catch (err) {
    throw new BlockchainError(
      "WALLET_UNAVAILABLE",
      `Backend service wallet unavailable: keypair file at "${resolvedPath}" is not a valid Solana secret key.`,
      { cause: err }
    );
  }
  return cachedServiceKeypair;
}

export function getServiceWalletPublicKey() {
  return loadServiceKeypair().publicKey;
}

export function getVaultTrustProgram(): anchor.Program<VaultTrust> {
  if (cachedProgram) return cachedProgram;

  const rpcUrl = process.env.SOLANA_RPC_URL;
  if (!rpcUrl) {
    throw new BlockchainError("RPC_UNAVAILABLE", "Solana Configuration Error: missing environment variable SOLANA_RPC_URL.");
  }

  // confirmTransactionInitialTimeout bounds how long the SDK's own internal
  // confirmation polling can run before giving up — without this it can hang
  // well past our own withTimeout() wrapper on some RPC providers.
  const connection = new Connection(rpcUrl, { commitment: "confirmed", confirmTransactionInitialTimeout: 20_000 });
  const wallet = new anchor.Wallet(loadServiceKeypair());
  const provider = new anchor.AnchorProvider(connection, wallet, { commitment: "confirmed" });

  cachedProgram = new anchor.Program<VaultTrust>(idl as anchor.Idl, provider);
  return cachedProgram;
}
