import * as adminImport from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const admin = adminImport as any;

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const hasAdminConfig = !!(projectId && clientEmail && privateKey);

let adminApp: any = null;

export function getFirebaseAdmin() {
  if (!hasAdminConfig) {
    return null;
  }
  
  if (admin.apps.length === 0) {
    try {
      adminApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (error) {
      console.error("Failed to initialize Firebase Admin SDK:", error);
      return null;
    }
  } else {
    adminApp = admin.apps[0];
  }
  return adminApp;
}

export function getAdminFirestore() {
  const adminSdk = getFirebaseAdmin();
  return adminSdk ? getFirestore() : null;
}

export function getAdminAuth() {
  const adminSdk = getFirebaseAdmin();
  return adminSdk ? getAuth() : null;
}
