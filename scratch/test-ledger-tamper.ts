import { appendLedgerEntry, verifyLedgerChain } from "../lib/ledger";
import { dbService, Consent } from "../lib/db";

async function runTamperTest() {
  console.log("=== STARTING LEDGER TAMPER-DETECTION UNIT TEST ===");

  const consentId = `test-consent-tamper-${Date.now()}`;

  // 1. Ensure database is clear of this test consent
  const local = dbService;
  
  // Create a base consent document to satisfy rules / queries
  const mockConsent: Consent = {
    id: consentId,
    freelancerId: "freelancer-tamper",
    bankId: "bank-tamper",
    sources: ["PAYONEER"],
    scope: "ALL",
    duration: "ONE_TIME",
    purpose: "TEST",
    status: "ACTIVE",
    grantedAt: new Date().toISOString(),
    revokedAt: null
  };
  await local.createConsent(mockConsent);

  // 2. Append three ledger blocks representing consecutive actions
  console.log("Appending Block 1 (GRANT)...");
  await appendLedgerEntry(consentId, "GRANT", { scopes: ["PAYONEER"] });

  console.log("Appending Block 2 (SCOPE_CHANGE)...");
  const block2 = await appendLedgerEntry(consentId, "SCOPE_CHANGE", { scopes: ["PAYONEER", "BANK_TRANSFER"] });

  console.log("Appending Block 3 (BANK_ACCESS)...");
  await appendLedgerEntry(consentId, "BANK_ACCESS", { accessedBy: "bank-tamper" });

  // 3. Verify the chain prior to mutation
  console.log("Verifying clean ledger chain...");
  const initialVerification = await verifyLedgerChain(consentId);
  console.log("Initial verification results:");
  initialVerification.forEach((res, idx) => {
    console.log(`  Block ${idx + 1}: verified = ${res.verified}, reason = ${res.reason}`);
  });

  const allInitiallyVerified = initialVerification.every(res => res.verified);
  console.assert(allInitiallyVerified, "Ledger verification failed on a clean chain!");
  if (allInitiallyVerified) {
    console.log("✔ Clean Chain Integrity Confirmed.");
  }

  // 4. Perform direct mutation (simulate a database hack / tampering)
  console.log("\nSimulating direct database tampering on Block 2...");
  const mutatedBlock2 = {
    ...block2,
    // Hack: secretly modify event type to GRANT (instead of SCOPE_CHANGE) or tamper payload
    eventType: "GRANT" as any,
  };
  // Write the tampered block directly back to the database, bypassing hashing functions
  await local.createLedgerEntry(mutatedBlock2);
  console.log("Tampered Block 2 written back to database.");

  // 5. Re-run verification
  console.log("\nVerifying tampered ledger chain...");
  const postTamperVerification = await verifyLedgerChain(consentId);
  postTamperVerification.forEach((res, idx) => {
    console.log(`  Block ${idx + 1}: verified = ${res.verified}, reason = ${res.reason}`);
  });

  // Block 1 should still be verified
  console.assert(postTamperVerification[0].verified === true, "Block 1 should still be valid!");
  
  // Block 2 should fail (due to payload/hash mismatch)
  console.assert(postTamperVerification[1].verified === false, "Block 2 should have failed verification!");
  
  // Block 3 should fail (due to previous hash pointer broken)
  console.assert(postTamperVerification[2].verified === false, "Block 3 should have failed verification!");

  if (
    postTamperVerification[0].verified === true &&
    postTamperVerification[1].verified === false &&
    postTamperVerification[2].verified === false
  ) {
    console.log("\n✔ SUCCESS: Tamper-detection caught the modified block and correctly invalidated all subsequent blocks.");
    console.log("=== LEDGER TAMPER-DETECTION UNIT TEST PASSED ===");
  } else {
    throw new Error("Tamper-detection test failed to isolate or invalidate correct blocks.");
  }
}

runTamperTest().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
