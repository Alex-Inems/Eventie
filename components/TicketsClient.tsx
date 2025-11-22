'use client';

import { useEffect, useState } from 'react';
import { ref, get, push } from 'firebase/database';
import { realtimeDb, auth } from '@/firebaseConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { HiTicket, HiCheckCircle, HiClock, HiUserGroup, HiArrowLeft, HiMapPin, HiCalendar, HiSparkles } from 'react-icons/hi2';
import { useRouter } from 'next/navigation';
import SmartImage from '@/components/SmartImage';

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

type Speaker = string | {
  name: string;
  bio?: string;
  photo?: string;
};

type EventDetails = {
  imageUrl?: string;
  description?: string;
  date?: string;
  time?: string;
  endTime?: string;
  location?: string;
  createdBy?: string;
  category?: string;
  speakers?: Speaker[];
  [key: string]: unknown;
};

const TicketsClient = ({ eventId }: { eventId: string }) => {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);

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

          setEventDetails(eventData);
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

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

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

  const handlePaystackPayment = (ticket: Ticket) => {
    if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
      toast.error('Payment system not configured');
      return;
    }

    if (!event) {
      toast.error('Event information not available');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast.error('Please sign in to purchase tickets');
      return;
    }

    // Store event in const so TypeScript knows it's not null in nested function
    const eventData = event;

    setProcessingPayment(ticket.id);
    const email = user.email || 'guest@example.com';
    const cleanPrice = ticket?.price ? ticket.price.replace(/[^0-9.]/g, '') : '0';
    const amount = cleanPrice && !isNaN(Number(cleanPrice)) ? Number(cleanPrice) * 100 : 100;
    const reference = `${user.uid}_${Date.now()}_${ticket.id}`;

    // Load Paystack script if not already loaded
    if (!window.PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => {
        initializePaystack();
      };
      script.onerror = () => {
        toast.error('Failed to load payment system. Please try again.');
        setProcessingPayment(null);
      };
      document.body.appendChild(script);
    } else {
      initializePaystack();
    }

    function initializePaystack() {
      try {
        const handler = window.PaystackPop.setup({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
          email,
          amount,
          currency: 'NGN',
          ref: reference,
          metadata: {
            eventId,
            ticketId: ticket.id,
            ticketType: ticket.type,
            custom_fields: [
              {
                display_name: 'Event',
                variable_name: 'event',
                value: eventData.title,
              },
              {
                display_name: 'Ticket Type',
                variable_name: 'ticket_type',
                value: ticket.type,
              },
            ],
          },
          callback: (response: PaystackResponse) => {
            setProcessingPayment(null);
            handlePaymentSuccess(response, ticket);
          },
          onClose: () => {
            setProcessingPayment(null);
            toast.warning('Payment process was interrupted');
          },
          channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
        });

        handler.openIframe();
      } catch (error) {
        console.error('Paystack initialization error:', error);
        toast.error('Failed to initialize payment. Please try again.');
        setProcessingPayment(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#040404]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-orange-200" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#040404] text-white">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-semibold">Event Not Found</h2>
          <p className="mb-6 text-lg text-gray-400">We couldn&apos;t find the event you were looking for.</p>
          <button
            className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
            onClick={() => router.push('/events')}
          >
            View All Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040404] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-gray-400 transition hover:text-white"
        >
          <HiArrowLeft className="h-5 w-5" />
          <span>Back to Event</span>
        </button>

        {/* Event Image */}
        {eventDetails?.imageUrl && (
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-3xl md:h-80">
            <SmartImage 
              src={eventDetails.imageUrl} 
              alt={event.title} 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="mb-2 text-4xl font-bold md:text-5xl">{event.title}</h1>
              {eventDetails.category && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm">
                  <HiSparkles className="h-4 w-4 text-orange-200" />
                  {eventDetails.category.charAt(0).toUpperCase() + eventDetails.category.slice(1)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Event Details Grid */}
        {eventDetails && (
          <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {eventDetails.date && (
              <div className="rounded-2xl border border-white/10 bg-black/70 p-6">
                <div className="mb-2 flex items-center gap-2 text-orange-200">
                  <HiCalendar className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wide">Date</span>
                </div>
                <p className="text-lg font-semibold">
                  {new Date(eventDetails.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  {new Date(eventDetails.date).toLocaleDateString('en-US', { weekday: 'long' })}
                </p>
              </div>
            )}
            
            {eventDetails.time && (
              <div className="rounded-2xl border border-white/10 bg-black/70 p-6">
                <div className="mb-2 flex items-center gap-2 text-orange-200">
                  <HiClock className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wide">Time</span>
                </div>
                <p className="text-lg font-semibold">{formatTime(eventDetails.time)}</p>
                {eventDetails.endTime && (
                  <p className="mt-1 text-sm text-gray-400">Until {formatTime(eventDetails.endTime)}</p>
                )}
              </div>
            )}

            {eventDetails.location && (
              <div className="rounded-2xl border border-white/10 bg-black/70 p-6">
                <div className="mb-2 flex items-center gap-2 text-orange-200">
                  <HiMapPin className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wide">Location</span>
                </div>
                <p className="text-lg font-semibold line-clamp-2">{eventDetails.location}</p>
              </div>
            )}

            {eventDetails.createdBy && (
              <div className="rounded-2xl border border-white/10 bg-black/70 p-6">
                <div className="mb-2 flex items-center gap-2 text-orange-200">
                  <HiUserGroup className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wide">Organizer</span>
                </div>
                <p className="text-lg font-semibold">{eventDetails.createdBy}</p>
              </div>
            )}
          </div>
        )}

        {/* Event Description */}
        {eventDetails?.description && (
          <div className="mb-12 rounded-3xl border border-white/10 bg-black/70 p-8">
            <h2 className="mb-4 text-2xl font-semibold">About This Event</h2>
            <p className="leading-relaxed text-gray-300">{eventDetails.description}</p>
          </div>
        )}

        {/* Speakers Section */}
        {eventDetails?.speakers && Array.isArray(eventDetails.speakers) && eventDetails.speakers.length > 0 && (
          <div className="mb-12 rounded-3xl border border-white/10 bg-black/70 p-8">
            <h2 className="mb-6 text-2xl font-semibold">Featured Speakers</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {eventDetails.speakers.slice(0, 6).map((speaker: Speaker, index: number) => (
                <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  {typeof speaker === 'string' ? (
                    <p className="font-semibold">{speaker}</p>
                  ) : (
                    <>
                      <h3 className="mb-1 font-semibold">{speaker.name}</h3>
                      {speaker.bio && (
                        <p className="text-sm text-gray-400 line-clamp-2">{speaker.bio}</p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tickets Section */}
        <div className="mb-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Available Tickets</h2>
            <span className="text-sm text-gray-400">
              {event.tickets.length} {event.tickets.length === 1 ? 'option' : 'options'} available
            </span>
          </div>
          
        {event.tickets.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {event.tickets.map((ticket) => {
                const isAvailable = ticket?.quantity && parseInt(ticket.quantity) > 0;
                const isPopular = ticket.type === 'VIP' || ticket.type === 'Early Bird';

    return (
                  <div
                    key={ticket.id}
                    className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 ${
                      isPopular
                        ? 'border-orange-200/30 bg-gradient-to-br from-orange-500/10 to-black/70'
                        : 'border-white/10 bg-black/70'
                    } ${!isAvailable ? 'opacity-60' : 'hover:border-white/20 hover:shadow-xl'}`}
                  >
                    {isPopular && (
                      <div className="absolute right-4 top-4 rounded-full bg-orange-200/20 px-3 py-1 text-xs font-semibold text-orange-200">
                        Popular
                      </div>
                    )}

                    <div className="p-8">
                      <div className="mb-6 flex items-start justify-between">
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <HiTicket className="h-6 w-6 text-orange-200" />
                            <h3 className="text-2xl font-bold">{ticket.type}</h3>
                          </div>
                          {ticket.type === 'VIP' && (
                            <p className="text-sm text-gray-400">Premium experience with exclusive access</p>
                          )}
                          {ticket.type === 'Early Bird' && (
                            <p className="text-sm text-gray-400">Limited time offer - Save now!</p>
                          )}
                        </div>
                      </div>

                      <div className="mb-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Price</span>
                          <span className="text-3xl font-bold text-white">
                            {ticket.price || 'Free'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-t border-white/10 pt-3">
                          <div className="flex items-center gap-2 text-gray-400">
                            <HiUserGroup className="h-4 w-4" />
                            <span>Available</span>
                          </div>
                          <span className={`font-semibold ${isAvailable ? 'text-green-400' : 'text-red-400'}`}>
                            {isAvailable ? `${ticket.quantity} tickets` : 'Sold Out'}
                          </span>
                        </div>
                      </div>

        {process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ? (
                        <button
                          onClick={() => handlePaystackPayment(ticket)}
                          disabled={!isAvailable || processingPayment === ticket.id}
                          className={`w-full rounded-full border px-6 py-4 font-semibold transition-all duration-300 ${
                            isAvailable && processingPayment !== ticket.id
                              ? isPopular
                                ? 'border-orange-200 bg-orange-200 text-gray-900 hover:bg-orange-300'
                                : 'border-white/20 bg-white/10 text-white hover:border-white hover:bg-white/20'
                              : 'cursor-not-allowed border-white/10 bg-white/5 text-gray-500'
                          }`}
                        >
                          {processingPayment === ticket.id ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Processing...
                            </span>
                          ) : isAvailable ? (
                            'Purchase Ticket'
                          ) : (
                            'Sold Out'
                          )}
                        </button>
                      ) : (
                        <div className="rounded-full border border-red-500/30 bg-red-500/10 px-6 py-4 text-center text-sm text-red-200">
                          Payment system not configured
                        </div>
                      )}
                    </div>
      </div>
    );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-black/70 p-12 text-center">
              <HiTicket className="mx-auto mb-4 h-16 w-16 text-gray-600" />
              <h3 className="mb-2 text-xl font-semibold">No Tickets Available</h3>
              <p className="text-gray-400">Tickets for this event are not yet available. Please check back later.</p>
            </div>
          )}
      </div>

        {/* QR Code Section */}
      {qrData && (
          <div className="rounded-3xl border border-green-500/30 bg-green-500/10 p-8">
            <div className="mb-4 flex items-center gap-2 text-green-200">
              <HiCheckCircle className="h-6 w-6" />
              <h3 className="text-xl font-semibold">Payment Successful!</h3>
            </div>
            <p className="mb-6 text-gray-300">Your ticket has been purchased. Show this QR code at the event entrance.</p>
        <QRCodeGenerator
          data={qrData}
          eventId={event.id}
          ticketType={qrData.split('_')[1] || 'N/A'}
          username={qrData.split('_')[0] || 'Anonymous'}
        />
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 rounded-3xl border border-white/10 bg-black/70 p-8">
          <h3 className="mb-4 text-xl font-semibold">Important Information</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <HiCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
              <span>All ticket sales are final. No refunds or exchanges.</span>
            </li>
            <li className="flex items-start gap-3">
              <HiCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
              <span>Please arrive at least 30 minutes before the event starts.</span>
            </li>
            <li className="flex items-start gap-3">
              <HiCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
              <span>Bring a valid ID and your ticket QR code for entry.</span>
            </li>
            <li className="flex items-start gap-3">
              <HiCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
              <span>For any questions, contact the event organizer.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TicketsClient;
