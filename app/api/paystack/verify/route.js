import { NextResponse } from "next/server";
import axios from "axios";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const reference = searchParams.get("reference");

        if (!reference) {
            return NextResponse.json({ success: false, message: "Missing reference" }, { status: 400 });
        }

        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` }
            }
        );

        const paymentData = response.data.data;

        if (paymentData.status === "success") {
            return NextResponse.json({ success: true, data: paymentData });
        } else {
            return NextResponse.json({ success: false, message: "Payment failed or incomplete" });
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.response?.data || "Verification failed" },
            { status: 500 }
        );
    }
}
