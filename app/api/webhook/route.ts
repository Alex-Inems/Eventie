import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDatabase, ref, update } from 'firebase/database';
import { initializeApp } from 'firebase/app';

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Get Paystack secret key
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

/**
 * Verifies Paystack webhook signature.
 */
const verifyPaystackSignature = (signature: string | null, payload: string | null) => {
  if (!signature || !payload) return false;

  const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(payload)
    .digest('hex');

  return signature === hash;
};

/**
 * Handles Paystack webhook events.
 */
export async function POST(req: NextRequest) {
  try {
    // Read raw request body as text
    const payload = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    // Verify Paystack signature
    if (!verifyPaystackSignature(signature, payload)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Parse the JSON event after verifying the signature
    const event = JSON.parse(payload);

    console.log('Paystack Event Received:', event);

    // Process Paystack events
    switch (event.event) {
      case 'charge.success': {
        const transactionRef = event.data.reference;
        console.log(`✅ Payment successful: ${transactionRef}`);

        // Save transaction details in Firebase
        await update(ref(db, `transactions/${transactionRef}`), {
          status: 'success',
          amount: event.data.amount / 100, // Convert from kobo to Naira
          currency: event.data.currency,
          email: event.data.customer.email,
          date: new Date().toISOString(),
        });

        // TODO: Send email confirmation asynchronously
        return NextResponse.json({ message: 'Payment recorded successfully' });
      }

      case 'charge.failed': {
        console.log(`❌ Payment failed: ${event.data.reference}`);

        // Mark transaction as failed
        await update(ref(db, `transactions/${event.data.reference}`), {
          status: 'failed',
        });

        return NextResponse.json({ message: 'Payment failure recorded' });
      }

      default:
        console.log(`⚠️ Unhandled event: ${event.event}`);
        return NextResponse.json({ message: 'Event received but not handled' });
    }
  } catch (error) {
    console.error('🚨 Webhook Processing Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
