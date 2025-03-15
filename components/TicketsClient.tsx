'use client';

import { useEffect, useState } from 'react';
import { PaystackButton } from 'react-paystack';
import { ref, get, push } from 'firebase/database';
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

type PaystackResponse = {
  status: string;
  reference: string;
};

const TicketsClient = ({ eventId }: { eventId: string }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    const eventRef = ref(realtimeDb, `events/${eventId}`);
    get(eventRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const eventData = snapshot.val();

          // 🔥 Convert tickets object to array with ticket IDs included
          const ticketsArray = eventData.tickets 
            ? Object.keys(eventData.tickets).map((key) => ({
                id: key, 
                ...eventData.tickets[key],
              }))
            : [];

          console.log('Fetched Tickets:', ticketsArray); // ✅ Debugging here
          console.log('Fetched Event Data:', eventData); // ✅ Check full event details
          console.log('Converted Tickets:', ticketsArray); // ✅ Check ticket details

          setEvent({
            id: snapshot.key!,
            title: eventData.title,
            tickets: ticketsArray,
          });
        } else {
          toast.error('Event not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching event:', error);
        toast.error('Error fetching event details');
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  const handlePaymentSuccess = (response: PaystackResponse, ticket: Ticket) => {
    toast.success('Payment Successful!');

    const user = auth.currentUser;
    if (!user) return;

    const attendeeRef = ref(realtimeDb, `events/${eventId}/attendees`);
    const newAttendee = {
      email: user.email,
      ticketType: ticket.type,
      purchaseReference: response.reference,
      timestamp: Date.now(),
    };

    push(attendeeRef, newAttendee).then(() => {
      const qrCodeData = `${user.email}_${ticket.type}_${response.reference}`;
      setQrData(qrCodeData);
    });
  };

  if (loading) return <div className="text-center py-16">Loading event details...</div>;
  if (!event) return <div className="text-center py-16">Event not found</div>;

  return (
    <div className="bg-white max-w-3xl mx-auto py-16 px-6 flex-grow">
      <h1 className="text-4xl font-bold mb-6 text-center">{event.title}</h1>

      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Available Tickets</h3>
        {event.tickets.length > 0 ? (
  event.tickets.map((ticket) => {
    // ✅ Clean the price to remove symbols like $, ₦, NGN, and commas
    const cleanPrice = ticket?.price ? ticket.price.replace(/[^0-9.]/g, '') : '0';

    console.log('Cleaned Price:', cleanPrice); // ✅ Check if price is being fetched correctly

    return (
      <div key={ticket.id} className="mb-6 p-4 border rounded-lg shadow-md">
        <h4 className="text-xl font-semibold">{ticket.type}</h4>
        <p className="text-lg text-gray-700">Price: {ticket.price} NGN</p>
        <p className="text-lg text-gray-700">Quantity: {ticket.quantity}</p>

        {process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ? (
          <PaystackButton
            className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
            amount={cleanPrice && !isNaN(Number(cleanPrice)) ? Number(cleanPrice) * 100 : 100}
            email={auth?.currentUser?.email || 'guest@example.com'}
            publicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY}
            text="Purchase"
            reference={`${auth?.currentUser?.uid || 'guest'}_${Date.now()}`}
            onSuccess={(response: PaystackResponse) => handlePaymentSuccess(response, ticket)}
            onClose={() => toast.warning('Payment process was interrupted')}
            disabled={!ticket?.quantity || parseInt(ticket.quantity) <= 0}
          />
        ) : (
          <p className="text-red-500">Paystack key not found</p>
        )}
      </div>
    );
  })
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

export default TicketsClient;
