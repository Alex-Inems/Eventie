"use client";
import { useState, useEffect, useContext } from "react";
import  AuthContext  from "@/context/AuthContext";
import { db } from "@/firebaseConfig"; // Correct Firebase import
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
                const userTicketRef = ref(db, `users/${user.uid}/selectedTicket`);
                const snapshot = await get(userTicketRef);

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
                const ticketRef = ref(db, `tickets/${ticketId}`);
                const snapshot = await get(ticketRef);

                if (snapshot.exists()) {
                    setAmount(snapshot.val().price);
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
      console.log("handlePayment started"); // Log before anything runs
  
      if (!email) {
          console.log("No email found");
          alert("User email is required for payment.");
          return;
      }
  
      if (!amount) {
          console.log("Invalid ticket amount");
          alert("Invalid ticket amount.");
          return;
      }
  
      setLoading(true);
      
      try {
          console.log("Sending API request...");
  
          const response = await fetch("/api/paystack/initiate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, amount })
          });
  
          console.log("API response received");
  
          const data = await response.json();
  
          console.log("Response Data:", data);
  
          if (data.success) {
              console.log("Redirecting to:", data.data.authorization_url);
              window.location.href = data.data.authorization_url;
          } else {
              console.error("Payment initiation failed:", data.message);
              alert("Payment initiation failed!");
          }
      } catch (error) {
          console.error("Error processing payment:", error);
          alert("Error processing payment.");
      } finally {
          setLoading(false);
          console.log("handlePayment completed");
      }
  };
    return (
      <button onClick={handlePayment} className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading || !amount}>
      {loading ? "Processing..." : "Pay Now"}
  </button>
  

    );
}
