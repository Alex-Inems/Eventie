'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ref, get, update, push } from 'firebase/database';
import { realtimeDb, auth } from '@/firebaseConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QRCodeGenerator from '@/components/QRCodeGenerator';

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
  const [qrData, setQrData] = useState<string | null>(null);

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
          toast.error('Event not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching event:', error);
        toast.error('Error fetching event details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const handlePayment = async (ticket: Ticket) => {
    const user = auth.currentUser;

    if (!user) {
      toast.info('Please log in to purchase tickets.');
      return;
    }

    if (parseInt(ticket.quantity) <= 0) {
      toast.error('Ticket is sold out');
      return;
    }

    const paystack = (window as unknown as { PaystackPop: { setup: (config: PaystackConfig) => { openIframe: () => void } } }).PaystackPop;

    const paymentHandler = paystack.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
      email: user.email || '',
      amount: parseInt(ticket.price) * 100,
      currency: 'NGN',
      ref: `event_${event?.id}_ticket_${ticket.id}`,
      callback: async (response) => {
        if (response.status === 'success') {
          toast.success('Payment Successful!');
          const qrString = `${user.displayName}_${ticket.type}_${event?.title}_${response.reference}`;
          setQrData(qrString);

          // Save Attendee in Realtime DB
          const attendeeRef = ref(realtimeDb, `attendees/${event?.id}`);
          await push(attendeeRef, {
            username: user.displayName || 'Anonymous',
            email: user.email,
            ticketType: ticket.type,
            reference: response.reference,
            dateTime: new Date().toISOString(), // Save current date-time
          });

          // Reduce Ticket Quantity
          const ticketRef = ref(realtimeDb, `events/${event?.id}/tickets/${ticket.id}`);
          const newQuantity = parseInt(ticket.quantity) - 1;
          await update(ticketRef, { quantity: newQuantity });
          setEvent((prev) =>
            prev
              ? {
                  ...prev,
                  tickets: prev.tickets.map((t) =>
                    t.id === ticket.id ? { ...t, quantity: newQuantity.toString() } : t
                  ),
                }
              : null
          );
        } else {
          toast.error('Payment failed. Try again.');
        }
      },
      onClose: () => {
        toast.warning('Payment process was interrupted');
      },
    });

    paymentHandler.openIframe();
  };

  if (loading) return <div className="text-center py-16">Loading event details...</div>;
  if (!event) return <div className="text-center py-16">Event not found</div>;

  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold mb-6 text-center">{event.title}</h1>

      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Available Tickets</h3>
        {event.tickets.length > 0 ? (
          event.tickets.map((ticket) => (
            <div key={ticket.id} className="mb-6 p-4 border rounded-lg shadow-md">
              <h4 className="text-xl font-semibold">{ticket.type}</h4>
              <p className="text-lg text-gray-700">Price: {ticket.price} NGN</p>
              <p className="text-lg text-gray-700">Quantity: {ticket.quantity}</p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
                onClick={() => handlePayment(ticket)}
                disabled={parseInt(ticket.quantity) <= 0}
              >
                {parseInt(ticket.quantity) > 0 ? 'Purchase' : 'Sold Out'}
              </button>
            </div>
          ))
        ) : (
          <p>No tickets available</p>
        )}
      </div>

      {qrData && (
        <QRCodeGenerator
          data={qrData}
          eventId={event.id}
          ticketType={qrData.split('_')[1] || 'N/A'}
          username={qrData.split('_')[0] || 'Anonymous'}
        />
      )}
    </div>
  );
};

export default TicketsPage;
