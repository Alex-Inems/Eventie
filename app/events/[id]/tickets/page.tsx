'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ref, get } from 'firebase/database';
import { realtimeDb, auth } from '@/firebaseConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '@/components/Sidebar';
import { getAuth } from 'firebase/auth';
import Mobilenav from '@/components/Mobilenav';
import { QRCodeCanvas } from 'qrcode.react';

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
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string>('');
  const [userName, setUserName] = useState('');

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
        console.error('Error fetching event details:', error);
        toast.error('Error fetching event details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const handlePayment = (ticket: Ticket) => {
    const user = auth.currentUser;

    if (!user) {
      toast.info('Please log in to purchase tickets.');
      return;
    }

    const paystack = (window as unknown as { PaystackPop: { setup: (config: PaystackConfig) => { openIframe: () => void } } }).PaystackPop;

    const paymentRef = `event_${event?.id}_ticket_${ticket.id}_${Date.now()}`;
    const paymentHandler = paystack.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
      email: user.email || '',
      amount: parseInt(ticket.price) * 100,
      currency: 'NGN',
      ref: paymentRef,
      callback: (response: { status: string; reference: string }) => {
        if (response.status === 'success') {
          setQrCodeData(paymentRef);
          toast.success('Payment Successful!');
          router.push('/dashboard/organizer');
        } else {
          toast.error('Payment failed. Please try again.');
        }
      },
      onClose: () => {
        toast.warning('Payment process was interrupted');
      },
    });

    paymentHandler.openIframe();
  };

  const logout = () => {
    const auth = getAuth();
    auth.signOut().then(() => {
      router.push('/auth');
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <Sidebar userName={userName} userProfilePic={profilePic} logout={logout} />
      <h1 className="text-4xl font-bold mb-4">{event.title}</h1>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Available Tickets</h3>
        {event.tickets.length > 0 ? (
          event.tickets.map((ticket, idx) => (
            <div key={ticket.id} className="mb-4 p-4 border rounded-lg">
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

      {qrCodeData && (
        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-2">Your Ticket QR Code</h3>
          <QRCodeCanvas value={qrCodeData} size={200} />
          <p className="text-lg text-center mt-4">Show this QR code at the event entrance.</p>
        </div>
      )}

      <Mobilenav router={router} logout={logout} />
    </div>
  );
};

export default TicketsPage;
