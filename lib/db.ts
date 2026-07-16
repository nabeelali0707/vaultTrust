import { getAdminFirestore } from "./firebase_admin";
import fs from "fs/promises";
import path from "path";

// Define Interfaces matching production specifications
export interface User {
  id: string; // uid from Firebase Auth
  name: string;
  email: string;
  role: "FREELANCER" | "BANK_OFFICER";
  kycStatus: "NOT_STARTED" | "SIMULATED_PASS" | "VERIFIED" | "FAILED";
  createdAt: string;
}

export interface FreelancerProfile {
  userId: string;
  city: string;
  monthlyIncomeMin: number;
  monthlyIncomeMax: number;
}

export interface ConnectedSource {
  id: string; // e.g. platform name or uuid
  freelancerId: string;
  platform: "PAYONEER" | "BANK_TRANSFER" | "LOCAL_INVOICING";
  status: "CONNECTED" | "DISCONNECTED";
  connectedAt: string;
  provider: "sandbox" | "live";
}

export interface Transaction {
  id: string;
  sourceId: string;
  freelancerId: string;
  amount: number;
  currency: string;
  date: string; // ISO string
  clientLabel: string;
}

export interface Consent {
  id: string; // freelancerId_bankId
  freelancerId: string;
  bankId: string;
  sources: ("PAYONEER" | "BANK_TRANSFER" | "LOCAL_INVOICING")[];
  scope: string;
  duration: "ONE_TIME" | "ROLLING_6MO";
  purpose: string;
  status: "ACTIVE" | "REVOKED";
  grantedAt: string;
  revokedAt: string | null;
}

export interface ConsentLedgerEntry {
  id: string;
  consentId: string;
  eventType: "GRANT" | "SCOPE_CHANGE" | "REVOKE" | "BANK_ACCESS";
  timestamp: string; // ISO string
  payloadHash: string;
  prevHash: string;
  thisHash: string;
  solanaTxSignature?: string;
}

export interface IncomeScore {
  freelancerId: string;
  avgMonthlyIncome: number;
  coefficientOfVariation: number;
  trend: "GROWING" | "STABLE" | "DECLINING";
  sourceDiversityScore: number;
  ivs: number;
  eligibilityBandPKR: string;
  computedAt: string;
}

// Local File Database helper (Offline / Fallback Mode)
const localDbPath = path.join(process.cwd(), "lib", "local_db.json");

interface LocalDbSchema {
  users: User[];
  profiles: FreelancerProfile[];
  sources: ConnectedSource[];
  transactions: Transaction[];
  consents: Consent[];
  ledger: ConsentLedgerEntry[];
  scores: IncomeScore[];
}

const emptyDb: LocalDbSchema = {
  users: [],
  profiles: [],
  sources: [],
  transactions: [],
  consents: [],
  ledger: [],
  scores: [],
};

async function readLocalDb(): Promise<LocalDbSchema> {
  try {
    await fs.mkdir(path.dirname(localDbPath), { recursive: true });
    const content = await fs.readFile(localDbPath, "utf-8");
    return JSON.parse(content);
  } catch (e) {
    await writeLocalDb(emptyDb);
    return emptyDb;
  }
}

async function writeLocalDb(data: LocalDbSchema): Promise<void> {
  await fs.mkdir(path.dirname(localDbPath), { recursive: true });
  await fs.writeFile(localDbPath, JSON.stringify(data, null, 2), "utf-8");
}

// Dual-Mode Database Service
export const dbService = {
  // --- USERS ---
  async getUser(id: string): Promise<User | null> {
    const firestore = getAdminFirestore();
    if (firestore) {
      const snap = await firestore.collection("users").doc(id).get();
      return snap.exists ? (snap.data() as User) : null;
    } else {
      const local = await readLocalDb();
      return local.users.find((u) => u.id === id) || null;
    }
  },

  async createUser(user: User): Promise<void> {
    const firestore = getAdminFirestore();
    if (firestore) {
      await firestore.collection("users").doc(user.id).set(user);
    } else {
      const local = await readLocalDb();
      local.users = local.users.filter((u) => u.id !== user.id);
      local.users.push(user);
      await writeLocalDb(local);
    }
  },

  async updateUser(id: string, fields: Partial<User>): Promise<void> {
    const firestore = getAdminFirestore();
    if (firestore) {
      await firestore.collection("users").doc(id).update(fields);
    } else {
      const local = await readLocalDb();
      local.users = local.users.map((u) => (u.id === id ? { ...u, ...fields } : u));
      await writeLocalDb(local);
    }
  },

  async listUsers(): Promise<User[]> {
    const firestore = getAdminFirestore();
    if (firestore) {
      const snap = await firestore.collection("users").get();
      const users: User[] = [];
      snap.forEach((doc: any) => users.push(doc.data() as User));
      return users;
    } else {
      const local = await readLocalDb();
      return local.users;
    }
  },

  // --- PROFILES ---
  async getFreelancerProfile(userId: string): Promise<FreelancerProfile | null> {
    const firestore = getAdminFirestore();
    if (firestore) {
      const snap = await firestore.collection("freelancerProfiles").doc(userId).get();
      return snap.exists ? (snap.data() as FreelancerProfile) : null;
    } else {
      const local = await readLocalDb();
      return local.profiles.find((p) => p.userId === userId) || null;
    }
  },

  async createFreelancerProfile(profile: FreelancerProfile): Promise<void> {
    const firestore = getAdminFirestore();
    if (firestore) {
      await firestore.collection("freelancerProfiles").doc(profile.userId).set(profile);
    } else {
      const local = await readLocalDb();
      local.profiles = local.profiles.filter((p) => p.userId !== profile.userId);
      local.profiles.push(profile);
      await writeLocalDb(local);
    }
  },

  // --- CONNECTED SOURCES ---
  // Firestore: connectedSources/{uid}/sources/{sourceId}
  async listConnectedSources(freelancerId: string): Promise<ConnectedSource[]> {
    const firestore = getAdminFirestore();
    if (firestore) {
      const snap = await firestore
        .collection("connectedSources")
        .doc(freelancerId)
        .collection("sources")
        .get();
      const list: ConnectedSource[] = [];
      snap.forEach((doc: any) => list.push(doc.data() as ConnectedSource));
      return list;
    } else {
      const local = await readLocalDb();
      return local.sources.filter((s) => s.freelancerId === freelancerId);
    }
  },

  async getConnectedSource(freelancerId: string, sourceId: string): Promise<ConnectedSource | null> {
    const firestore = getAdminFirestore();
    if (firestore) {
      const snap = await firestore
        .collection("connectedSources")
        .doc(freelancerId)
        .collection("sources")
        .doc(sourceId)
        .get();
      return snap.exists ? (snap.data() as ConnectedSource) : null;
    } else {
      const local = await readLocalDb();
      return local.sources.find((s) => s.freelancerId === freelancerId && s.id === sourceId) || null;
    }
  },

  async createConnectedSource(source: ConnectedSource): Promise<void> {
    const firestore = getAdminFirestore();
    if (firestore) {
      await firestore
        .collection("connectedSources")
        .doc(source.freelancerId)
        .collection("sources")
        .doc(source.id)
        .set(source);
    } else {
      const local = await readLocalDb();
      local.sources = local.sources.filter(
        (s) => !(s.freelancerId === source.freelancerId && s.id === source.id)
      );
      local.sources.push(source);
      await writeLocalDb(local);
    }
  },

  async updateConnectedSource(
    freelancerId: string,
    sourceId: string,
    fields: Partial<ConnectedSource>
  ): Promise<void> {
    const firestore = getAdminFirestore();
    if (firestore) {
      await firestore
        .collection("connectedSources")
        .doc(freelancerId)
        .collection("sources")
        .doc(sourceId)
        .update(fields);
    } else {
      const local = await readLocalDb();
      local.sources = local.sources.map((s) =>
        s.freelancerId === freelancerId && s.id === sourceId ? { ...s, ...fields } : s
      );
      await writeLocalDb(local);
    }
  },

  // --- TRANSACTIONS ---
  // Firestore: transactions/{uid}/sources/{sourceId}/records/{txId}
  async listTransactions(freelancerId: string): Promise<Transaction[]> {
    const firestore = getAdminFirestore();
    if (firestore) {
      // Fetch connected sources first
      const sourcesSnap = await firestore
        .collection("connectedSources")
        .doc(freelancerId)
        .collection("sources")
        .get();
      
      const allTx: Transaction[] = [];
      for (const srcDoc of sourcesSnap.docs) {
        const sourceId = srcDoc.id;
        const txSnap = await firestore
          .collection("transactions")
          .doc(freelancerId)
          .collection("sources")
          .doc(sourceId)
          .collection("records")
          .get();
        
        txSnap.forEach((doc: any) => allTx.push(doc.data() as Transaction));
      }
      return allTx;
    } else {
      const local = await readLocalDb();
      return local.transactions.filter((t) => t.freelancerId === freelancerId);
    }
  },

  async listTransactionsForSource(freelancerId: string, sourceId: string): Promise<Transaction[]> {
    const firestore = getAdminFirestore();
    if (firestore) {
      const snap = await firestore
        .collection("transactions")
        .doc(freelancerId)
        .collection("sources")
        .doc(sourceId)
        .collection("records")
        .get();
      const list: Transaction[] = [];
      snap.forEach((doc: any) => list.push(doc.data() as Transaction));
      return list;
    } else {
      const local = await readLocalDb();
      return local.transactions.filter((t) => t.freelancerId === freelancerId && t.sourceId === sourceId);
    }
  },

  async bulkCreateTransactions(
    freelancerId: string,
    sourceId: string,
    transactions: Transaction[]
  ): Promise<void> {
    const firestore = getAdminFirestore();
    if (firestore) {
      const batch = firestore.batch();
      const baseRef = firestore
        .collection("transactions")
        .doc(freelancerId)
        .collection("sources")
        .doc(sourceId)
        .collection("records");
      
      for (const t of transactions) {
        const docRef = baseRef.doc(t.id);
        batch.set(docRef, t);
      }
      await batch.commit();
    } else {
      const local = await readLocalDb();
      const txIds = new Set(transactions.map((t) => t.id));
      local.transactions = local.transactions.filter(
        (t) => !(t.freelancerId === freelancerId && t.sourceId === sourceId && txIds.has(t.id))
      );
      local.transactions.push(...transactions);
      await writeLocalDb(local);
    }
  },

  // --- CONSENT ---
  // Firestore: consents/{consentId}
  async getConsent(id: string): Promise<Consent | null> {
    const firestore = getAdminFirestore();
    if (firestore) {
      const snap = await firestore.collection("consents").doc(id).get();
      return snap.exists ? (snap.data() as Consent) : null;
    } else {
      const local = await readLocalDb();
      return local.consents.find((c) => c.id === id) || null;
    }
  },

  async getActiveConsent(freelancerId: string, bankId?: string): Promise<Consent | null> {
    const firestore = getAdminFirestore();
    if (firestore) {
      let queryRef = firestore
        .collection("consents")
        .where("freelancerId", "==", freelancerId)
        .where("status", "==", "ACTIVE");
      
      if (bankId) {
        queryRef = queryRef.where("bankId", "==", bankId);
      }
      
      const snap = await queryRef.get();
      let active: Consent | null = null;
      snap.forEach((doc: any) => {
        active = doc.data() as Consent;
      });
      return active;
    } else {
      const local = await readLocalDb();
      return (
        local.consents.find(
          (c) =>
            c.freelancerId === freelancerId &&
            c.status === "ACTIVE" &&
            (!bankId || c.bankId === bankId)
        ) || null
      );
    }
  },

  async createConsent(consent: Consent): Promise<void> {
    const firestore = getAdminFirestore();
    if (firestore) {
      await firestore.collection("consents").doc(consent.id).set(consent);
    } else {
      const local = await readLocalDb();
      local.consents = local.consents.filter((c) => c.id !== consent.id);
      local.consents.push(consent);
      await writeLocalDb(local);
    }
  },

  async updateConsent(id: string, fields: Partial<Consent>): Promise<void> {
    const firestore = getAdminFirestore();
    if (firestore) {
      await firestore.collection("consents").doc(id).update(fields);
    } else {
      const local = await readLocalDb();
      local.consents = local.consents.map((c) => (c.id === id ? { ...c, ...fields } : c));
      await writeLocalDb(local);
    }
  },

  // --- LEDGER ---
  // Firestore: consentLedger/{consentId}/entries/{entryId}
  async listLedgerEntries(consentId: string): Promise<ConsentLedgerEntry[]> {
    const firestore = getAdminFirestore();
    if (firestore) {
      const snap = await firestore
        .collection("consentLedger")
        .doc(consentId)
        .collection("entries")
        .orderBy("timestamp", "asc")
        .get();
      
      const list: ConsentLedgerEntry[] = [];
      snap.forEach((doc: any) => list.push(doc.data() as ConsentLedgerEntry));
      return list;
    } else {
      const local = await readLocalDb();
      return local.ledger
        .filter((entry) => entry.consentId === consentId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
  },

  async listLedgerEntriesForFreelancer(freelancerId: string): Promise<ConsentLedgerEntry[]> {
    const firestore = getAdminFirestore();
    if (firestore) {
      // Fetch all consents for the freelancer
      const consentsSnap = await firestore
        .collection("consents")
        .where("freelancerId", "==", freelancerId)
        .get();
      
      const allEntries: ConsentLedgerEntry[] = [];
      for (const consentDoc of consentsSnap.docs) {
        const consentId = consentDoc.id;
        const entriesSnap = await firestore
          .collection("consentLedger")
          .doc(consentId)
          .collection("entries")
          .get();
        
        entriesSnap.forEach((doc: any) => allEntries.push(doc.data() as ConsentLedgerEntry));
      }
      return allEntries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } else {
      const local = await readLocalDb();
      const consents = local.consents.filter((c) => c.freelancerId === freelancerId);
      const consentIds = new Set(consents.map((c) => c.id));
      return local.ledger
        .filter((entry) => consentIds.has(entry.consentId))
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
  },

  async createLedgerEntry(entry: ConsentLedgerEntry): Promise<void> {
    const firestore = getAdminFirestore();
    if (firestore) {
      await firestore
        .collection("consentLedger")
        .doc(entry.consentId)
        .collection("entries")
        .doc(entry.id)
        .set(entry);
    } else {
      const local = await readLocalDb();
      local.ledger = local.ledger.filter((l) => l.id !== entry.id);
      local.ledger.push(entry);
      await writeLocalDb(local);
    }
  },

  async getLatestLedgerEntry(consentId: string): Promise<ConsentLedgerEntry | null> {
    const firestore = getAdminFirestore();
    if (firestore) {
      const snap = await firestore
        .collection("consentLedger")
        .doc(consentId)
        .collection("entries")
        .orderBy("timestamp", "desc")
        .limit(1)
        .get();
      
      return !snap.empty ? (snap.docs[0].data() as ConsentLedgerEntry) : null;
    } else {
      const local = await readLocalDb();
      const entries = local.ledger.filter((l) => l.consentId === consentId);
      if (entries.length === 0) return null;
      return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    }
  },

  // --- INCOME SCORES ---
  // Firestore: incomeScores/{uid}
  async getIncomeScore(freelancerId: string): Promise<IncomeScore | null> {
    const firestore = getAdminFirestore();
    if (firestore) {
      const snap = await firestore.collection("incomeScores").doc(freelancerId).get();
      return snap.exists ? (snap.data() as IncomeScore) : null;
    } else {
      const local = await readLocalDb();
      return local.scores.find((s) => s.freelancerId === freelancerId) || null;
    }
  },

  async upsertIncomeScore(score: IncomeScore): Promise<void> {
    const firestore = getAdminFirestore();
    if (firestore) {
      await firestore.collection("incomeScores").doc(score.freelancerId).set(score);
    } else {
      const local = await readLocalDb();
      local.scores = local.scores.filter((s) => s.freelancerId !== score.freelancerId);
      local.scores.push(score);
      await writeLocalDb(local);
    }
  },

  // Reset/Empty Helper (Used for Seeding or testing)
  async clearAll(): Promise<void> {
    const firestore = getAdminFirestore();
    if (firestore) {
      // For testing/seeding purposes, we can delete documents.
      // But since we are in production Firestore mode, we should be careful.
      // We will only call clearAll in test/seeding contexts.
      const collections = ["users", "freelancerProfiles", "connectedSources", "transactions", "consents", "consentLedger", "incomeScores"];
      for (const col of collections) {
        const snap = await firestore.collection(col).get();
        for (const doc of snap.docs) {
          await firestore.recursiveDelete(doc.ref);
        }
      }
    } else {
      await writeLocalDb(emptyDb);
    }
  }
};
