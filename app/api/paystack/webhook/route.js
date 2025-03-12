import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const event = await req.json();

        if (event.event === "charge.success") {
            console.log("✅ Payment Successful:", event.data);
            // Store transaction in database, update ticket info, etc.
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook error:", error); // Log the error to use it
        return NextResponse.json({ success: false, message: "Webhook error" }, { status: 500 });
    }
}
