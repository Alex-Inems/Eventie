import { NextResponse } from "next/server";
import axios from "axios";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req) {
    try {
        const { email, amount } = await req.json();

        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                amount, // Amount is already in Naira
                currency: "NGN",
                callback_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment-success`
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return NextResponse.json({ success: true, data: response.data.data });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.response?.data || "Payment initiation failed" },
            { status: 500 }
        );
    }
}
