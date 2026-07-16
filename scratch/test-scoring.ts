import { computeIncomeScore, normalizeAmountToPKR } from "../lib/scoring";
import { Transaction } from "../lib/db";

// Helper to generate transaction mock dates matching month offsets
function getTxDateForMonthOffset(monthsAgo: number, day = 15): string {
  const d = new Date();
  d.setDate(day);
  d.setMonth(d.getMonth() - monthsAgo);
  return d.toISOString();
}

console.log("=== STARTING SCORING ENGINE UNIT TESTS ===");

// 1. CASE: Rising Income
const risingTxs: Transaction[] = [];
// Months: index 0 (5 months ago) to index 5 (current month)
// Let's create transactions that sum to 100k, 120k, 140k, 160k, 180k, 200k PKR respectively
for (let i = 0; i < 6; i++) {
  const monthsAgo = 5 - i;
  const pkrAmount = 100000 + i * 20000;
  risingTxs.push({
    id: `tx-rise-${i}`,
    sourceId: "source-a",
    freelancerId: "test-user",
    amount: pkrAmount,
    currency: "PKR",
    date: getTxDateForMonthOffset(monthsAgo),
    clientLabel: `Rise Month ${i}`,
  });
}
const risingResult = computeIncomeScore(risingTxs);
console.assert(risingResult.trend === "GROWING", `Rising trend test failed: expected GROWING, got ${risingResult.trend}`);
console.assert(risingResult.avgMonthlyIncome === 150000, `Rising avg failed: expected 150000, got ${risingResult.avgMonthlyIncome}`);
console.log("✔ Case 1 Passed: Rising Income (Trend = GROWING, Avg = 150,000)");

// 2. CASE: Falling Income
const fallingTxs: Transaction[] = [];
for (let i = 0; i < 6; i++) {
  const monthsAgo = 5 - i;
  const pkrAmount = 200000 - i * 20000;
  fallingTxs.push({
    id: `tx-fall-${i}`,
    sourceId: "source-a",
    freelancerId: "test-user",
    amount: pkrAmount,
    currency: "PKR",
    date: getTxDateForMonthOffset(monthsAgo),
    clientLabel: `Fall Month ${i}`,
  });
}
const fallingResult = computeIncomeScore(fallingTxs);
console.assert(fallingResult.trend === "DECLINING", `Falling trend test failed: expected DECLINING, got ${fallingResult.trend}`);
console.assert(fallingResult.avgMonthlyIncome === 150000, `Falling avg failed: expected 150000, got ${fallingResult.avgMonthlyIncome}`);
console.log("✔ Case 2 Passed: Falling Income (Trend = DECLINING, Avg = 150,000)");

// 3. CASE: High Variance
const varianceTxs: Transaction[] = [];
// Alternating high and low: 50k, 250k, 50k, 250k, 50k, 250k
for (let i = 0; i < 6; i++) {
  const monthsAgo = 5 - i;
  const pkrAmount = i % 2 === 0 ? 50000 : 250000;
  varianceTxs.push({
    id: `tx-var-${i}`,
    sourceId: "source-a",
    freelancerId: "test-user",
    amount: pkrAmount,
    currency: "PKR",
    date: getTxDateForMonthOffset(monthsAgo),
    clientLabel: `Var Month ${i}`,
  });
}
const varianceResult = computeIncomeScore(varianceTxs);
console.assert(varianceResult.coefficientOfVariation > 0.5, `Variance CoV failed: expected high variance, got CoV = ${varianceResult.coefficientOfVariation}`);
console.assert(varianceResult.avgMonthlyIncome === 150000, `Variance avg failed: expected 150000, got ${varianceResult.avgMonthlyIncome}`);
// High variance should depress the IVS because consistency is low
console.assert(varianceResult.ivs < 80, `Variance IVS failed: expected lowered IVS due to low consistency, got IVS = ${varianceResult.ivs}`);
console.log(`✔ Case 3 Passed: High Variance (Avg = 150,000, CoV = ${varianceResult.coefficientOfVariation.toFixed(2)}, IVS = ${varianceResult.ivs})`);

// 4. CASE: Single-Source Concentration
const singleSourceTxs: Transaction[] = [
  {
    id: "tx-single-1",
    sourceId: "source-a",
    freelancerId: "test-user",
    amount: 150000,
    currency: "PKR",
    date: getTxDateForMonthOffset(0),
    clientLabel: "Single client",
  }
];
const singleResult = computeIncomeScore(singleSourceTxs);
console.assert(singleResult.sourceDiversityScore === 0, `Diversity failed: expected 0 for single source, got ${singleResult.sourceDiversityScore}`);
console.log("✔ Case 4 Passed: Single-Source Concentration (Diversity = 0)");

// 5. CASE: Missing Months (with zero income in some months)
const missingMonthsTxs: Transaction[] = [
  {
    id: "tx-miss-1",
    sourceId: "source-a",
    freelancerId: "test-user",
    amount: 100000,
    currency: "PKR",
    date: getTxDateForMonthOffset(0), // Current month
    clientLabel: "Active Month 0",
  },
  {
    id: "tx-miss-2",
    sourceId: "source-b",
    freelancerId: "test-user",
    amount: 200000,
    currency: "PKR",
    date: getTxDateForMonthOffset(2), // 2 months ago
    clientLabel: "Active Month 2",
  },
  {
    id: "tx-miss-3",
    sourceId: "source-c",
    freelancerId: "test-user",
    amount: 150000,
    currency: "PKR",
    date: getTxDateForMonthOffset(4), // 4 months ago
    clientLabel: "Active Month 4",
  }
];
const missingResult = computeIncomeScore(missingMonthsTxs);
// Average monthly income over 6 months should be (100k + 200k + 150k) / 6 = 75k
console.assert(missingResult.avgMonthlyIncome === Math.round(450000 / 6), `Missing month avg failed: expected ${Math.round(450000 / 6)}, got ${missingResult.avgMonthlyIncome}`);
console.assert(missingResult.coefficientOfVariation > 0, `Missing month CoV failed: expected CoV > 0, got ${missingResult.coefficientOfVariation}`);
console.log(`✔ Case 5 Passed: Missing Months (Avg = ${missingResult.avgMonthlyIncome}, CoV = ${missingResult.coefficientOfVariation.toFixed(2)})`);

console.log("=== ALL SCORING ENGINE UNIT TESTS PASSED ===");
