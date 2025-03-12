"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
    const searchParams = useSearchParams();
    const reference = searchParams.get("reference");
    const [status, setStatus] = useState("Verifying...");

    useEffect(() => {
        if (reference) {
            fetch(`/api/paystack/verify?reference=${reference}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setStatus("Payment Successful ✅");
                    } else {
                        setStatus("Payment Failed ❌");
                    }
                })
                .catch(() => setStatus("Verification Error ❌"));
        }
    }, [reference]);

    return (
        <div className="text-center p-10">
            <h1 className="text-2xl">{status}</h1>
        </div>
    );
}
