"use client";

import { useState, useEffect, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import { db } from "@/firebaseConfig"; // Firebase import
import { ref, get } from "firebase/database"; // Realtime Database functions

export default function PaystackButton() {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(null);
    const [ticketId, setTicketId] = useState(null);
    const { user } = useContext(AuthContext);
    const email = user?.email;

    // Fetch user's selected ticket ID from Firebase
    useEffect(() => {
        const fetchUserTicket = async () => {
            if (!user?.uid) return;

            try {
                const snapshot = await get(ref(db, `users/${user.uid}/selectedTicket`));
                if (snapshot.exists()) {
                    setTicketId(snapshot.val());
                } else {
                    console.error("No ticket selected.");
                }
            } catch (error) {
                console.error("Error fetching ticket ID:", error);
            }
        };

        fetchUserTicket();
    }, [user?.uid]);

    // Fetch ticket price using the ticket ID
    useEffect(() => {
        const fetchTicketPrice = async () => {
            if (!ticketId) return;

            try {
                const snapshot = await get(ref(db, `tickets/${ticketId}`));
                if (snapshot.exists()) {
                    const ticketData = snapshot.val();
                    setAmount(ticketData?.price);
                } else {
                    console.error("Ticket not found.");
                }
            } catch (error) {
                console.error("Error fetching ticket price:", error);
            }
        };

        fetchTicketPrice();
    }, [ticketId]);

    const handlePayment = async () => {
        if (!email) {
            alert("User email is required for payment.");
            return;
        }

        if (!amount) {
            alert("Invalid ticket amount.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/paystack/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    amount: parseInt(amount) // Convert to integer (in Kobo)
                })
            });

            const data = await res.json();

            if (data?.success) {
                // Redirect to Paystack payment page
                window.location.href = data.data.authorization_url;
            } else {
                console.error("Payment error:", data?.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("Error processing payment:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handlePayment} 
            className={`bg-green-600 text-white px-4 py-2 rounded ${loading && "opacity-50"}`}
            disabled={loading || !amount}
        >
            {loading ? "Processing..." : `Pay ₦${amount || 0}`}
        </button>
    );
}
