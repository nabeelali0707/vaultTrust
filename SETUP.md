# VaultTrust Backend Setup Guide

This document outlines the setup instructions, environment variables, Firestore specifications, and Solana devnet configurations required to run VaultTrust in production or local development mode.

---

## 🔑 Environment Variables (.env.local)

Create a `.env.local` file in the root of your project directory and populate the following keys. 

```bash
# ==========================================
# Firebase Client Configuration (NEXT_PUBLIC)
# ==========================================
NEXT_PUBLIC_FIREBASE_API_KEY=your-client-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# ==========================================
# Firebase Admin SDK Configuration (Server-side)
# ==========================================
# Firebase Client Email from the Service Account JSON
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
# Private Key from the Service Account JSON (replace \n with actual newlines)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC..."

# ==========================================
# Solana Devnet Configurations
# ==========================================
# Keypair array of numbers representing your funded devnet keypair.
# E.g., generated via `solana-keygen new` and funded via `solana airdrop 1`
SOLANA_PRIVATE_KEY="[142,23,55,102,...,99]"

# ==========================================
# Third-Party Provider Credentials (Live Mode)
# ==========================================
# If omitted, VaultTrust will fall back to using the Sandboxed adapters.
PAYONEER_CLIENT_ID=your-payoneer-client-id
PAYONEER_CLIENT_SECRET=your-payoneer-client-secret
PAYONEER_REDIRECT_URI=http://localhost:3000/api/v1/connectors/callback

UPWORK_CLIENT_ID=your-upwork-client-id
UPWORK_CLIENT_SECRET=your-upwork-client-secret

# Onfido credentials for live KYC verification
ONFIDO_API_KEY=your-onfido-api-key
ONFIDO_WORKFLOW_ID=your-onfido-workflow-id
```

---

## 🔥 Firebase Configuration

### 1. Firebase Authentication
VaultTrust uses Firebase Auth with email/password and Google Sign-In. User roles are managed via Custom Claims:
- **FREELANCER**: Has read/write access to their own transaction data, linked connectors, and active consents.
- **BANK_OFFICER**: Granted access to view lending dashboard applicant assessment records.

*Note: User roles are injected into the ID Token custom claims server-side during the onboarding API call (`/api/v1/onboarding`).*

### 2. Firestore Collections & Subcollections
Our database service maps to the following collection schemas:
- `users/{uid}`: Contains core freelancer/banker user info.
- `freelancerProfiles/{uid}`: Freelancer demographics.
- `connectedSources/{uid}/sources/{sourceId}`: Linked data platforms (e.g. Payoneer sandbox).
- `transactions/{uid}/sources/{sourceId}/records/{txId}`: List of deposits and transfers.
- `consents/{consentId}`: Consent policies (ID structure is always `${freelancerId}_${bankId}`).
- `consentLedger/{consentId}/entries/{entryId}`: Append-only hash chain blocks.
- `incomeScores/{uid}`: Explanatory credit metrics.

### 3. Deploying Security Rules
Deploy the included `firestore.rules` to enforce access control:
```bash
firebase deploy --only firestore:rules
```

---

## ⛓️ Solana Devnet Setup

VaultTrust publishes a cryptographic hash for every consent event (Grant, Revocation, Update, Bank Access) to the Solana Devnet via the **Memo Program** (`Memorig1111111111111111111111111111111111`).

### 1. Install Solana CLI Tools
If not already installed, set up the Solana CLI:
```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)"
```

### 2. Create a Keypair
Generate a new keypair for the server:
```bash
solana-keygen new --outfile server-keypair.json
```
Read the private key array from `server-keypair.json` (a list of numbers) and copy it into the `SOLANA_PRIVATE_KEY` env variable.

### 3. Airdrop Devnet Sol (Lamports)
Set your CLI configuration to Devnet:
```bash
solana config set --url https://api.devnet.solana.com
```
Request an airdrop to fund transactions (minimum of 0.05 SOL is recommended):
```bash
solana airdrop 1 <YOUR_SOLANA_PUBLIC_KEY>
```

---

## 🧪 Running Unit Tests

To run the unit tests locally (which verify scoring logic and hash-chain tampering detection):

### 1. Run Scoring Engine Unit Tests
```bash
npx tsx scratch/test-scoring.ts
```

### 2. Run Cryptographic Hash-Chain Tamper Tests
```bash
npx tsx scratch/test-ledger-tamper.ts
```
