PROMPT 0 — Build the Safety-Net Fallback First (Do This Before Anything Blockchain-Related)

Before any Solana work, implement a local, simulated tamper-evident consent ledger 
as a guaranteed-working fallback.

Requirements:
- A module that records every consent event (grant, scope change, revocation, 
  bank access) as a JSON object.
- Each record includes: consent_id, purpose_hash, scope_hash, timestamp, status, 
  and a SHA256 hash of (previous_record_hash + current_record_data).
- Store these records in a dedicated PostgreSQL table (consent_ledger).
- Provide a verify() function that recalculates the hash chain and flags any 
  record whose hash doesn't match — proving tamper-evidence without needing 
  a live blockchain.
- Do not touch existing consent/auth/dashboard code — only add this as a new, 
  isolated module.

This must be fully working before we touch Solana. It is our fallback if 
blockchain integration doesn't finish in time.
PROMPT 1 — Analyze the Existing Project (Start Here)

You are a senior Solana + Node.js engineer.

I already have a working project.

Frontend: React + TypeScript
Backend: Node.js + Express
Database: PostgreSQL

The application already has:
- Authentication
- Consent screen
- Income aggregation
- Income Verification Score (IVS)
- Bank dashboard
- A simulated consent ledger (added in Prompt 0)

Do NOT rewrite any existing code.

Identify:
1. Where consent is currently created.
2. Which backend routes handle consent.
3. Which database tables store consent.
4. Which frontend pages interact with consent.
5. Where blockchain integration should be added with minimal code changes, 
   sitting alongside (not replacing) the simulated ledger.

Do not modify any code yet. Only produce an implementation plan.
PROMPT 2 — Prepare Solana Environment (With Version Locking)

Prepare this project for Solana Devnet.

Requirements:
1. Check and report installed versions of Rust, Solana CLI, and Anchor CLI.
2. Pin to a known-compatible version set for all three (verify compatibility 
   before proceeding — do not assume latest versions work together).
3. Install all required Solana and Anchor dependencies.
4. Configure the backend project.
5. Create a clean folder structure:
   /backend
     /blockchain
       /program
       /client
       /utils
6. Do NOT change frontend. Do NOT change database. Do NOT modify business logic.

Do not implement functionality yet. Only prepare the environment and confirm 
versions are compatible before moving forward.

TIME-BOX: If environment setup is not working within 2 hours, stop and report 
the blocker — we will proceed with the simulated ledger only.
PROMPT 3 — Design the Custodial Wallet Model

Before writing the smart contract, implement a custodial wallet model:

- Each freelancer does NOT need their own Solana wallet or browser extension.
- On account creation, the backend generates a Solana keypair for that user 
  and stores the private key securely (encrypted at rest) in the backend — 
  never exposed to the frontend.
- All consent transactions are signed and submitted by the backend on the 
  user's behalf, referencing their internally-managed wallet address.
- This keeps the freelancer experience identical to a normal app — no wallet 
  installation, no seed phrases, no gas fee management from their side.

Confirm this model before proceeding to the smart contract.
PROMPT 4 — Create the Smart Contract (Privacy-Conscious)

Create a Solana smart contract using Anchor. The program should only manage 
consent — no financial data.

Implement four instructions:
- grant_consent
- update_consent
- revoke_consent
- log_bank_access

Each consent record should store ON-CHAIN:
- Consent ID
- User Wallet (custodial, backend-managed)
- Purpose HASH (SHA256 of purpose string — not the plaintext)
- Scope HASH (SHA256 of scope string — not the plaintext)
- Expiry
- Timestamp
- Status

Do NOT store plaintext purpose, scope, or any financial information on-chain — 
only hashes. Plaintext values remain in PostgreSQL, referenced by the same hash 
for lookup.

Follow Anchor best practices. Generate clean, commented code.
PROMPT 5 — Test on Local Validator First

Before deploying to devnet, spin up a local Solana test validator and deploy 
the program there.

Requirements:
1. Deploy to localnet.
2. Run a full test cycle: grant_consent → update_consent → revoke_consent → 
   log_bank_access.
3. Confirm all instructions execute and return expected state changes.
4. Only proceed to devnet once localnet tests pass cleanly.

TIME-BOX: If localnet setup/testing takes more than 3 hours, stop and report — 
fall back to the simulated ledger as primary.
PROMPT 6 — Deploy to Devnet

Deploy the tested Anchor program to Solana Devnet.

Generate:
- Program ID
- IDL
- Deployment instructions
- Backend service wallet setup (funded via devnet faucet/airdrop)
- Verification steps (confirm program is live and callable)

Do not integrate with backend business logic yet. Only confirm the smart 
contract is live and independently callable on devnet.
PROMPT 7 — Build the Backend Blockchain Client

Connect the existing Express backend to the deployed Solana program.

Requirements:
- Create a blockchain client module using the custodial wallet model from Prompt 3.
- Expose reusable functions: grantConsent(), updateConsent(), revokeConsent(), 
  logBankAccess() — each accepting plaintext purpose/scope, hashing them 
  internally before submission to Solana.
- Do not modify existing routes yet. Create reusable functions only.
PROMPT 8 — Integrate Existing Consent Route (Dual-Write)

Modify the existing consent API to write to BOTH the simulated ledger (Prompt 0) 
AND Solana, so we always have a guaranteed-working record even if blockchain 
calls fail.

New flow:
Frontend → Express Route → Generate purpose/scope hash → 
  [Write to simulated ledger] AND [Call grantConsent() on Solana] → 
  Save both the local hash-chain record and the Solana transaction signature 
  in PostgreSQL → Return success response

If the Solana call fails or times out, the request should still succeed using 
the simulated ledger record, and log the blockchain failure for retry later.

Keep backward compatibility with existing API response format.
PROMPT 9 — Integrate Revocation (Same Dual-Write Safety Pattern)

Modify the existing revoke consent API using the same dual-write safety pattern 
as Prompt 8: update simulated ledger first (guaranteed), then attempt Solana 
revokeConsent(), storing the transaction signature if successful, logging 
failure for retry if not.

Keep existing frontend compatible.
PROMPT 10 — Log Bank Access

Whenever a bank views freelancer data, call logBankAccess() using the same 
dual-write pattern (simulated ledger + Solana attempt).

Record: Consent ID, Bank ID, Timestamp, Wallet, Transaction Signature 
(if available).

Use async/non-blocking processing so this never slows down dashboard load times.
PROMPT 11 — Add Verification API

Create GET /api/consent/:id/verify

The endpoint should:
1. Read consent from PostgreSQL.
2. Recalculate the simulated ledger hash chain and check integrity.
3. If a Solana transaction signature exists, fetch the on-chain record and 
   compare hashes.
4. Return: Verified / Tampered / Blockchain-Pending (if only simulated ledger 
   is confirmed and Solana write is still retrying).
5. Include: transaction signature (if present), timestamp, program ID.

Keep code modular.
PROMPT 12 — Update Frontend (Non-Destructive)

Update the frontend without redesigning existing UI:

Freelancer Dashboard: Consent Status, Verification Badge (Simulated / 
Blockchain-Confirmed), Grant Time, Revocation Time, Transaction Signature 
(if available)

Bank Dashboard: Verification Badge, Consent Active status, Audit Trail, 
Transaction Signature, Devnet Explorer Link (if available)

Integrate into current components only.
PROMPT 13 — Error Handling

Add production-quality error handling for:
- Backend service wallet unavailable
- Network timeout to Solana RPC
- Solana devnet unavailable
- Transaction failed
- Confirmation timeout
- Retry logic for failed Solana writes (with the simulated ledger as source 
  of truth in the meantime)
- Database rollback safety

Display meaningful frontend messages. Never crash the application, and never 
block a user action solely because Solana is unreachable.
PROMPT 14 — Final Code Review

Review the entire blockchain integration.

Check: security, Anchor best practices, Node.js best practices, code 
duplication, performance, scalability, error handling, unused files, dead code, 
and confirm the dual-write safety pattern is consistently applied everywhere.

Generate a final report with recommended improvements. Do not rewrite working 
code unless necessary.