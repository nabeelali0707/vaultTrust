import crypto from "crypto";

// AES-256-GCM encryption for custodial wallet secret keys at rest.
// WALLET_ENCRYPTION_KEY must be a 32-byte key, base64-encoded.
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getEncryptionKey(): Buffer {
  const key = process.env.WALLET_ENCRYPTION_KEY;
  if (!key) {
    throw new Error(
      "Wallet Encryption Configuration Error. Missing environment variable: WALLET_ENCRYPTION_KEY. " +
        "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""
    );
  }
  const buf = Buffer.from(key, "base64");
  if (buf.length !== 32) {
    throw new Error(
      `Wallet Encryption Configuration Error. WALLET_ENCRYPTION_KEY must decode to exactly 32 bytes, got ${buf.length}.`
    );
  }
  return buf;
}

export interface EncryptedSecret {
  iv: string; // base64
  authTag: string; // base64
  ciphertext: string; // base64
}

export function encryptSecretBytes(secret: Uint8Array): EncryptedSecret {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(secret), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
    ciphertext: ciphertext.toString("base64"),
  };
}

export function decryptSecretBytes(encrypted: EncryptedSecret): Uint8Array {
  const key = getEncryptionKey();
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(encrypted.iv, "base64"));
  decipher.setAuthTag(Buffer.from(encrypted.authTag, "base64"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(encrypted.ciphertext, "base64")),
    decipher.final(),
  ]);
  return new Uint8Array(plaintext);
}
