import { dbService, User, FreelancerProfile, ConnectedSource, Transaction } from "./db";

// Helper to generate UUID-like IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const FX_RATES = {
  USD: 280,
  PKR: 1,
};

export async function seedDatabase(force: boolean = false) {
  // If not force, check if users already exist
  if (!force) {
    const existing = await dbService.getUser("ahmed-raza-id");
    if (existing) {
      console.log("Database already seeded. Skipping...");
      return;
    }
  }

  console.log("Seeding database...");
  await dbService.clearAll();

  // 1. Seed Users (with required fields: createdAt, kycStatus)
  const users: User[] = [
    {
      id: "ahmed-raza-id",
      name: "Ahmed Raza",
      role: "FREELANCER",
      email: "ahmed.raza@gmail.com",
      kycStatus: "SIMULATED_PASS",
      createdAt: new Date().toISOString(),
    },
    {
      id: "sana-malik-id",
      name: "Sana Malik",
      role: "FREELANCER",
      email: "sana.malik@gmail.com",
      kycStatus: "SIMULATED_PASS",
      createdAt: new Date().toISOString(),
    },
    {
      id: "ubl-bank-id",
      name: "UBL Digital Lending Team",
      role: "BANK_OFFICER",
      email: "lending@ubl.com.pk",
      kycStatus: "VERIFIED",
      createdAt: new Date().toISOString(),
    },
  ];

  for (const u of users) {
    await dbService.createUser(u);
  }

  // 2. Seed Freelancer Profiles
  const profiles: FreelancerProfile[] = [
    {
      userId: "ahmed-raza-id",
      city: "Lahore",
      monthlyIncomeMin: 150000,
      monthlyIncomeMax: 250000,
    },
    {
      userId: "sana-malik-id",
      city: "Karachi",
      monthlyIncomeMin: 80000,
      monthlyIncomeMax: 120000,
    },
  ];

  for (const p of profiles) {
    await dbService.createFreelancerProfile(p);
  }

  // 3. Seed Connected Sources
  const platforms: Array<"PAYONEER" | "BANK_TRANSFER" | "LOCAL_INVOICING"> = [
    "PAYONEER",
    "BANK_TRANSFER",
    "LOCAL_INVOICING",
  ];

  // Map to hold connected sources for transaction generation
  const sourcesMap: Record<string, ConnectedSource[]> = {};

  for (const p of profiles) {
    sourcesMap[p.userId] = [];
    for (const plat of platforms) {
      const source: ConnectedSource = {
        id: `${p.userId}_${plat.toLowerCase()}`,
        freelancerId: p.userId,
        platform: plat,
        status: "CONNECTED",
        connectedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        provider: "sandbox",
      };
      await dbService.createConnectedSource(source);
      sourcesMap[p.userId].push(source);
    }
  }

  // 4. Seed Transactions (6 Months)
  const now = new Date();
  const transactions: Transaction[] = [];

  const ahmedDist = { PAYONEER: 0.6, BANK_TRANSFER: 0.25, LOCAL_INVOICING: 0.15 };
  const sanaDist = { PAYONEER: 0.4, BANK_TRANSFER: 0.35, LOCAL_INVOICING: 0.25 };

  const clientLabels = {
    PAYONEER: ["Upwork Escrow", "Fiverr International", "Toptal Remote", "Direct Client US"],
    BANK_TRANSFER: ["Local Wire Transfer", "HBL Personal Transfer", "Standard Chartered Direct"],
    LOCAL_INVOICING: ["Software Invoice #1029", "Content Consulting Retainer", "Website Dev Milestone"],
  };

  const seedFreelancerTransactions = (
    userId: string,
    minInc: number,
    maxInc: number,
    dist: typeof ahmedDist,
    sources: ConnectedSource[]
  ) => {
    // For each of the last 6 months
    for (let m = 5; m >= 0; m--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - m, 15);
      
      // Determine this month's total income (with variance)
      const monthlyTotalPKR = minInc + Math.random() * (maxInc - minInc);

      // Distribute this income among platforms
      for (const source of sources) {
        const platformDist = dist[source.platform];
        const platformIncomePKR = monthlyTotalPKR * platformDist;
        
        // Split into 2-3 individual transactions per platform per month
        const numTransactions = Math.floor(Math.random() * 2) + 2; // 2 or 3
        const avgAmountPKR = platformIncomePKR / numTransactions;

        for (let t = 0; t < numTransactions; t++) {
          const variance = 0.8 + Math.random() * 0.4; // 80% to 120%
          const amountPKR = Math.round(avgAmountPKR * variance);
          
          // Random day in that month
          const day = Math.floor(Math.random() * 28) + 1;
          const txDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);

          // Determine currency
          const currency = source.platform === "PAYONEER" ? "USD" : "PKR";
          const amount = currency === "USD" ? Math.round((amountPKR / FX_RATES.USD) * 100) / 100 : amountPKR;

          const labels = clientLabels[source.platform];
          const clientLabel = labels[Math.floor(Math.random() * labels.length)];

          transactions.push({
            id: `tx_${userId}_${source.platform.toLowerCase()}_m${m}_t${t}`,
            sourceId: source.id,
            freelancerId: userId,
            amount,
            currency,
            date: txDate.toISOString(),
            clientLabel,
          });
        }
      }
    }
  };

  // Generate for Ahmed Raza
  seedFreelancerTransactions(
    "ahmed-raza-id",
    150000,
    250000,
    ahmedDist,
    sourcesMap["ahmed-raza-id"]
  );

  // Generate for Sana Malik
  seedFreelancerTransactions(
    "sana-malik-id",
    80000,
    120000,
    sanaDist,
    sourcesMap["sana-malik-id"]
  );

  // Group transactions by freelancerId and sourceId to match API signature
  const groups: Record<string, Transaction[]> = {};
  for (const tx of transactions) {
    const key = `${tx.freelancerId}#${tx.sourceId}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(tx);
  }

  for (const [key, txList] of Object.entries(groups)) {
    const [freelancerId, sourceId] = key.split("#");
    await dbService.bulkCreateTransactions(freelancerId, sourceId, txList);
  }

  console.log(`Seeded ${transactions.length} mock transactions!`);
}
