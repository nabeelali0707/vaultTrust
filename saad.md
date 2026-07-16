# VaultTrust — Backend Work Log

Project: VaultTrust (UBL National Innovation Hackathon 2026)
Stack: Next.js 16 (App Router) + Firebase Auth + Firestore + Zod
Status: Real backend, no mocks/fallbacks, blockchain removed

---

## 1. Architecture Overview

- All backend logic lives in Next.js Route Handlers under `app/api/v1/**` — no separate server.
- Firestore is the single, mandatory data layer. There is no local JSON fallback and no mock mode —
  if Firebase env vars are missing, the app throws a clear startup error naming the missing variable
  instead of silently degrading.
- Firebase Auth (email/password + Google) handles identity. Roles (`FREELANCER` / `BANK_OFFICER`)
  are set server-side via Firebase custom claims — never trusted from client input after signup.
- Security is enforced twice: once in each route handler (role/ownership checks) and again at the
  database layer via `firestore.rules` (defense in depth).
- Blockchain (Solana devnet) was fully removed. The consent ledger's tamper-evidence now comes
  purely from a local SHA-256 hash-chain, which is simpler, free, and doesn't depend on an external
  chain being reachable.

---

## 2. Auth & Identity

- `app/signup/page.tsx`, `app/login/page.tsx` — real signup/login UI using the Firebase client SDK
  (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`).
- `POST /api/v1/auth/register` — canonical user-creation endpoint. Creates the Firestore `users/{uid}`
  doc and sets the role custom claim via the Admin SDK. This is the **only** place role is assigned.
- After registration, the client forces an ID token refresh (`getIdToken(true)`) so the new role claim
  is available immediately — avoids the classic stale-claim bug.
- `lib/auth_helper.ts` — `verifyAuthToken()` validates the `Authorization: Bearer <idToken>` header
  via Firebase Admin SDK on every request. No cookie-based or mock-user fallback exists anymore.
- `lib/fetch_client.ts` — shared client helper (`fetchWithAuth`) that automatically attaches the
  current user's real Firebase ID token to every API call from the frontend.

---

## 3. Data Model (Firestore)

| Collection / Path | Purpose |
|---|---|
| `users/{uid}` | name, email, role, kycStatus, createdAt |
| `freelancerProfiles/{uid}` | city, income range |
| `connectedSources/{uid}/sources/{sourceId}` | platform, status, provider (`sandbox`/`live`) |
| `transactions/{uid}/sources/{sourceId}/records/{txId}` | amount, currency, date, client label |
| `consents/{consentId}` | freelancerId, bankId, sources[], scope, duration, purpose, status |
| `consentLedger/{consentId}/entries/{entryId}` | append-only hash-chain entries |
| `incomeScores/{uid}` | computed IVS + component breakdown |

---

## 4. API Routes Implemented

All routes verify the Firebase ID token and enforce role checks before touching any data.

- **`POST /api/v1/auth/register`** — creates user doc + sets role custom claim.
- **`POST /api/v1/onboarding`** — freelancer KYC trigger (sandbox KYC provider, `SIMULATED_PASS`
  status; real KYC provider stubbed behind the same interface, throws `NOT_CONFIGURED` without real
  credentials).
- **`POST /api/v1/connectors/link`** — connects a mock/live income source (Payoneer, bank transfer,
  local invoicing), pulls transaction history via a `PlatformAdapter`, recomputes the IVS score
  immediately after linking.
- **`GET /api/v1/connectors/summary`** — connected sources, recent transactions, 6-month monthly
  aggregates, source mix percentages — all currency-normalized to PKR.
- **`POST /api/v1/consent/grant`** — creates a consent record + appends a `GRANT` ledger entry.
- **`GET /api/v1/consent/active`** — the freelancer's current active consent.
- **`PUT /api/v1/consent/update`** — updates consent scope/sources/duration, appends a
  `SCOPE_CHANGE` ledger entry; blocked if the consent is already revoked.
- **`DELETE /api/v1/consent/revoke`** — revokes a consent, appends a `REVOKE` ledger entry; checks
  the caller actually owns the consent before allowing it.
- **`GET /api/v1/audit/ledger`** — full hash-chain history for the freelancer, each entry marked
  `verified: true/false` after recomputation.
- **`GET /api/v1/profile/reliability`** — computed Income Verification Score (IVS) with a
  component-by-component breakdown for the UI.
- **`GET /api/v1/lending/assess`** — bank-facing. 403s unless an `ACTIVE` consent names the
  requesting bank officer; returns aggregated income profile + IVS + eligibility band only (raw
  transactions withheld unless explicitly requested); appends a `BANK_ACCESS` ledger entry on every
  read.

---

## 5. Income Verification Scoring Engine (`lib/scoring.ts`)

Pure, rule-based, fully explainable — no ML/black box. `computeIncomeScore(transactions)` returns:

1. **Average Monthly Income** — mean of monthly totals across the trailing 6 months, all currencies
   normalized to PKR via a fixed FX table.
2. **Coefficient of Variation (CoV)** — stdDev / mean of monthly totals, measuring income stability.
3. **Trend** — linear regression slope over the 6-month window → `GROWING` / `STABLE` / `DECLINING`.
4. **Source Diversity Score** — `1 − (largest source's share of total income)`, penalizing
   concentration risk.
5. **Final IVS (0–100)** — weighted composite:
   - 40% Income Level (normalized between a 50k and 300k PKR floor/ceiling)
   - 25% Consistency (inverse of CoV)
   - 20% Trend
   - 15% Diversity
6. **Eligibility Band** — tiered lookup off the IVS score (Micro-credit → Classic → Gold → Platinum),
   clearly labeled as illustrative only, not a real underwriting decision.

---

## 6. Consent Hash-Chain Ledger (`lib/ledger.ts`)

- Every consent event (`GRANT`, `SCOPE_CHANGE`, `REVOKE`, `BANK_ACCESS`) is appended as an immutable
  entry: `thisHash = SHA-256(prevHash + JSON.stringify(payload))`, chained from a genesis
  `prevHash = "0".repeat(64)`.
- `verifyLedgerChain()` walks the chain and recomputes each hash, flagging any entry (and everything
  after it) as invalid if it's been tampered with.
- `firestore.rules` blocks all direct client writes to `consentLedger` — entries can only be
  appended server-side via the Admin SDK.
- A dedicated test (`scratch/test-ledger-tamper.ts`) mutates a stored entry directly in the database
  and confirms `verifyLedgerChain()` correctly detects and flags it.
- Solana devnet anchoring was originally built in, then fully removed per request — no blockchain
  dependency remains; the hash-chain works entirely standalone.

---

## 7. Data Source & KYC Adapters (`lib/adapters.ts`, `lib/kyc.ts`)

- `PlatformAdapter` interface with a working `SandboxAdapter` (generates realistic 6 months of
  transaction history per platform) and stubbed `PayoneerLiveAdapter` / `UpworkLiveAdapter` that
  throw `NOT_CONFIGURED` until real API credentials are supplied — same contract, zero rewrite needed
  when real credentials arrive.
- `KycProvider` interface with a `SandboxKycProvider` (`SIMULATED_PASS`) and a stubbed live provider
  behind the same interface — status is always labeled accurately (`SIMULATED_PASS` vs `VERIFIED`),
  never misrepresented as real when it isn't.

---

## 8. Security

- Every route derives the acting user's `uid`/`role` from the verified Firebase ID token — never
  from request body or query params.
- `firestore.rules`: freelancers can only read/write their own subtree; bank officers can only read
  `incomeScores`/`consentLedger` for freelancers who have an `ACTIVE` consent naming their uid as
  `bankId`; ledger writes are blocked at the rules layer entirely.
- Bank-facing endpoints return aggregated data only by default (no raw transactions) —
  data-minimization by design.
- Revoked consents are checked and immediately block bank access (`lending/assess` returns 403).

---

## 9. Known Remaining Work (not yet done)

- Merge the overlapping onboarding/register user-creation logic (onboarding should only handle KYC,
  not set roles).
- Remove leftover dead mock-uid string comparisons (`"sana-malik-id"`, `"ahmed-raza-id"`,
  `"ubl-bank-id"`) left over from the earlier cookie-mock era.
- Update `lib/seed.ts` to create real Firebase Auth accounts (via Admin SDK) instead of fixed string
  IDs, so seeded demo data is actually reachable through real login.
- Add `firestore.indexes.json` for the composite index the consent-lookup query needs (will
  otherwise throw `FAILED_PRECONDITION` on first real run).
- Note: `lib/rate_limiter.ts` is in-memory and won't hold a durable limit across Vercel serverless
  instances — fine for now, flagged for a future Firestore/Redis-backed version.
- Add npm scripts (`seed`, `test:scoring`, `test:ledger`) plus `tsx` as a dependency so the existing
  test/seed scripts can actually be run.
