import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const missingClientVars: string[] = [];
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  missingClientVars.push("NEXT_PUBLIC_FIREBASE_API_KEY");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
  missingClientVars.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  missingClientVars.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) {
  missingClientVars.push("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) {
  missingClientVars.push("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID) {
  missingClientVars.push("NEXT_PUBLIC_FIREBASE_APP_ID");
}

if (missingClientVars.length > 0) {
  throw new Error(
    `Firebase Client SDK Configuration Error. Missing environment variables: ${missingClientVars.join(
      ", "
    )}. Please define them in .env.local`
  );
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
