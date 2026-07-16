# VaultTrust Setup Guide

VaultTrust is a production-grade, consent-based financial data vault for freelancers using Next.js, Firebase Auth, and Firestore.

---

## 🔑 Environment Variables Configuration

Create a file named `.env.local` in the root of your project directory. Populate it with the keys from your Firebase project, using the format specified below:

```bash
# =========================================================================
# Firebase Client SDK Configurations (NEXT_PUBLIC_*)
# =========================================================================
NEXT_PUBLIC_FIREBASE_API_KEY=your-client-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# =========================================================================
# Firebase Admin SDK Credentials (Server-side Only)
# =========================================================================
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

---

## 🔥 Step-by-Step Firebase Setup

### 1. Create a Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or **Create a project**).
3. Enter your project name (e.g., `VaultTrust`), accept the terms, and click **Continue**.
4. Choose whether to enable Google Analytics (optional), then click **Create project**.

### 2. Configure Authentication Providers
1. In the left-hand sidebar, navigate to **Build** → **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, click **Email/Password** and toggle it to **Enabled**. Click **Save**.
4. Click **Add new provider**, select **Google**, toggle it to **Enabled**, select a support email, and click **Save**.

### 3. Initialize Firestore Database (Production Mode)
1. In the left-hand sidebar, navigate to **Build** → **Firestore Database**.
2. Click **Create database**.
3. Select **Start in production mode** (this enforces security rules immediately) and click **Next**.
4. Select a database location closest to your users (e.g., `asia-south1` or `us-central1`), and click **Enable**.

### 4. Deploy Firestore Security Rules
Deploy the included security rules from your local workspace using the Firebase CLI:
1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in to your Firebase account:
   ```bash
   firebase login
   ```
3. Initialize Firestore settings (select your active project):
   ```bash
   firebase use --add <your-project-id>
   ```
4. Deploy the rules file (`firestore.rules` located in the root of the project):
   ```bash
   firebase deploy --only firestore:rules
   ```

### 5. Generate Service Account Key (for Next.js Admin APIs)
1. In the Firebase Console, click the Gear icon next to **Project Overview** and select **Project settings**.
2. Navigate to the **Service accounts** tab.
3. Click **Generate new private key** at the bottom of the page.
4. Confirm by clicking **Generate key**. A JSON file containing your credentials will automatically download to your computer.
5. Map fields from the downloaded JSON file to your `.env.local` file:
   - Map `project_id` to `NEXT_PUBLIC_FIREBASE_PROJECT_ID`.
   - Map `client_email` to `FIREBASE_CLIENT_EMAIL`.
   - Map `private_key` (the entire string, including `\n` characters) to `FIREBASE_PRIVATE_KEY`.

---

## 🧪 Running Unit Tests

### 1. Run Scoring Engine Unit Tests
```bash
npx tsx scratch/test-scoring.ts
```

### 2. Run Cryptographic Hash-Chain Tamper Tests
```bash
npx tsx scratch/test-ledger-tamper.ts
```
*(Requires Firebase credentials to be populated in `.env.local` to execute database transactions)*
