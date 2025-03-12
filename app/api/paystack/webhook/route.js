import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Initialize Firebase safely in API routes
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);

export async function POST(req) {
    try {
        const event = await req.json();

        if (event.event === "charge.success") {
            console.log("✅ Payment Successful:", event.data);

            // 🚀 Save transaction to Firebase
            const paymentRef = ref(db, `payments/${event.data.id}`);
            await set(paymentRef, {
                amount: event.data.amount,
                currency: event.data.currency,
                status: event.data.status,
                email: event.data.customer.email,
                created_at: event.data.created_at
            });

            console.log("🔥 Payment saved to Firebase");
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ success: false, message: "Webhook error" }, { status: 500 });
    }
}
