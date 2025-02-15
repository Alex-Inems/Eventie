'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ref, get } from 'firebase/database';
import { realtimeDb } from '@/firebaseConfig';  
import { auth } from '@/firebaseConfig';  

type Ticket = {
  type: string;
  price: string;
  quantity: string;
  id: string;
};

type Event = {
  id: string;
  title: string;
  tickets: Ticket[];
};

type PaystackConfig = {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  callback: (response: { status: string; reference: string }) => void;
  onClose: () => void;
};

const TicketsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params
      .then((resolved) => {
        const eventRef = ref(realtimeDb, `events/${resolved.id}`);
        return get(eventRef);
      })
      .then((snapshot) => {
        if (snapshot.exists()) {
          const eventData = snapshot.val();
          setEvent({
            ...eventData,
            id: snapshot.key!,
            tickets: eventData.tickets || [],
          });
        } else {
          console.error('Event not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching event details:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const handlePayment = (ticket: Ticket) => {
    const user = auth.currentUser;  

    if (!user) {
      alert('Please log in to purchase tickets.');
      return;
    }

    const paystack = (window as unknown as { PaystackPop: { setup: (config: PaystackConfig) => { openIframe: () => void } } }).PaystackPop;

    const paymentHandler = paystack.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',  
      email: user.email || '',  
      amount: parseInt(ticket.price) * 100,  
      currency: 'NGN',  
      ref: `event_${event?.id}_ticket_${ticket.id}`,  
      callback: (response: { status: string; reference: string }) => {  
        if (response.status === 'success') {
          router.push('/dashboard');  
        } else {
          alert('Payment failed. Please try again.');
        }
      },
      onClose: () => {
        alert('Payment process was interrupted');
      },
    });

    paymentHandler.openIframe();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold mb-4">{event.title}</h1>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Available Tickets</h3>
        {event.tickets.length > 0 ? (
          event.tickets.map((ticket, idx) => (
            <div key={idx} className="mb-4 p-4 border rounded-lg">
              <h4 className="text-xl font-semibold">{ticket.type}</h4>
              <p className="text-lg text-gray-700">Price: {ticket.price} NGN</p>
              <p className="text-lg text-gray-700">Quantity Available: {ticket.quantity}</p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
                onClick={() => handlePayment(ticket)}
              >
                Purchase
              </button>
            </div>
          ))
        ) : (
          <p>No tickets available for this event.</p>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;
