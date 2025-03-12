import { NextResponse } from "next/server";
import { db } from "@/firebaseConfig"; // ✅ Import Firebase correctly
import { ref, set } from "firebase/database";

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
