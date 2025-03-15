import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req) {
    try {
        if (!PAYSTACK_SECRET_KEY) {
            throw new Error("Paystack secret key is missing");
        }

        const { email, amount } = await req.json();

        // Basic validation
        if (!email || !amount || isNaN(amount)) {
            return NextResponse.json(
                { success: false, message: "Invalid email or amount" },
                { status: 400 }
            );
        }

        // Convert amount to Kobo (Paystack standard)
        const amountInKobo = amount * 100;

        // Generate a secure reference (nonce)
        const nonce = crypto.randomBytes(16).toString("hex");

        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                amount: amountInKobo,
                currency: "NGN",
                reference: nonce,
                callback_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment-success`,
                metadata: {
                    email,
                    nonce,
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                    "Referrer-Policy": "strict-origin-when-cross-origin", // ✅ Fix CSP
                    "Access-Control-Allow-Origin": "*", // ✅ Allow external calls
                    "Content-Security-Policy": `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paystack.co`,
                }
            }
        );

        return NextResponse.json({ success: true, data: response.data.data });

    } catch (error) {
        console.error("Paystack Error:", error.response?.data || error.message);
        return NextResponse.json(
            {
                success: false,
                message: error.response?.data?.message || "Payment initiation failed",
            },
            { status: 500 }
        );
    }
}
