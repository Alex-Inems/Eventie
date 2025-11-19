'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getDatabase, ref, get } from 'firebase/database';
import { HiCalendar, HiMapPin, HiClock, HiTicket } from 'react-icons/hi2';
import SmartImage from '@/components/SmartImage';
import { extractIdFromSlug } from '@/utils/slug';
import Sidebar from '@/components/Sidebar';
import Mobilenav from '@/components/Mobilenav';

type Event = {
    id: string;
    title: string;
    description: string;
    date: string;
    time?: string;
    location: string;
    speakers?: string[] | { name: string; bio: string }[];
    imageUrl: string;
    organizerId?: string;
    tickets?: { type: string; price: string; quantity: string }[];
};

const EventDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!params?.slug) return;
            setLoading(true);
            try {
                const db = getDatabase();
                // Extract ID from slug
                const eventId = extractIdFromSlug(params.slug as string);

                // Try to find by ID first
                const eventRef = ref(db, `events/${eventId}`);
                const snapshot = await get(eventRef);

                if (snapshot.exists()) {
                    setEvent({ ...snapshot.val(), id: snapshot.key! });
                } else {
                    // If not found by ID, search all events for matching slug
                    const eventsRef = ref(db, 'events');
                    const allEventsSnapshot = await get(eventsRef);

                    if (allEventsSnapshot.exists()) {
                        const allEvents = allEventsSnapshot.val() as Record<string, Event>;
                        const foundEvent = Object.entries(allEvents).find(([key, value]) => {
                            const event = value as Event;
                            const eventSlug = `${event.title?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')}-${key}`;
                            return eventSlug === params.slug || key === eventId;
                        });

                        if (foundEvent) {
                            setEvent({ ...foundEvent[1], id: foundEvent[0] });
                        } else {
                            setEvent(null);
                        }
                    } else {
                        setEvent(null);
                    }
                }
            } catch (error) {
                console.error('Error fetching event details:', error);
                setEvent(null);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [params?.slug]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#040404]">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-orange-200" />
            </div>
        );
    }

    if (!event) {
        return (
            <main className="relative min-h-screen bg-[#040404] text-white">
                <Sidebar />
                <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center lg:ml-[320px]">
                    <h2 className="mb-4 text-3xl font-semibold">Event Not Found</h2>
                    <p className="mb-6 text-lg text-gray-400">
                        We couldn&apos;t find the event you were looking for. It might have been removed or the link might be incorrect.
                    </p>
                    <button
                        className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
                        onClick={() => router.push('/events')}
                    >
                        View All Events
                    </button>
                </div>
                <Mobilenav />
            </main>
        );
    }

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const formatTime = (timeString?: string) => {
        if (!timeString) return '';
        try {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${minutes} ${ampm}`;
        } catch {
            return timeString;
        }
    };

    return (
        <main className="relative min-h-screen bg-[#040404] text-white">
            <Sidebar />

            <div className="lg:ml-[320px]">
                {/* Hero Image */}
                <div className="relative h-96 w-full overflow-hidden">
                    <SmartImage
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                        fallbackSrc="/images/slide4.jpg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <h1 className="mb-4 text-4xl font-semibold sm:text-5xl">{event.title}</h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                            {event.date && (
                                <div className="flex items-center gap-2">
                                    <HiCalendar className="h-5 w-5" />
                                    <span>{formatDate(event.date)}</span>
                                </div>
                            )}
                            {event.time && (
                                <div className="flex items-center gap-2">
                                    <HiClock className="h-5 w-5" />
                                    <span>{formatTime(event.time)}</span>
                                </div>
                            )}
                            {event.location && (
                                <div className="flex items-center gap-2">
                                    <HiMapPin className="h-5 w-5" />
                                    <span>{event.location}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Description */}
                    <section className="mb-12 rounded-3xl border border-white/10 bg-black/70 p-8">
                        <h2 className="mb-4 text-2xl font-semibold">About this event</h2>
                        <p className="text-lg leading-relaxed text-gray-300">{event.description}</p>
                    </section>

                    {/* Speakers */}
                    {event.speakers && event.speakers.length > 0 && (
                        <section className="mb-12 rounded-3xl border border-white/10 bg-black/70 p-8">
                            <h2 className="mb-6 text-2xl font-semibold">Speakers</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {event.speakers.map((speaker, idx) => {
                                    const speakerName = typeof speaker === 'string' ? speaker : speaker.name;
                                    const speakerBio = typeof speaker === 'string' ? '' : speaker.bio;
                                    return (
                                        <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                            <h3 className="font-semibold">{speakerName}</h3>
                                            {speakerBio && <p className="mt-2 text-sm text-gray-400">{speakerBio}</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Tickets */}
                    {event.tickets && event.tickets.length > 0 && (
                        <section className="mb-12 rounded-3xl border border-white/10 bg-black/70 p-8">
                            <h2 className="mb-6 text-2xl font-semibold">Ticket Options</h2>
                            <div className="space-y-4">
                                {event.tickets.map((ticket, idx) => (
                                    <div key={idx} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <div>
                                            <h3 className="font-semibold">{ticket.type}</h3>
                                            <p className="text-sm text-gray-400">
                                                {ticket.quantity} {parseInt(ticket.quantity) === 1 ? 'ticket' : 'tickets'} available
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-semibold">{ticket.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* CTA Button */}
                    <div className="mb-14">
                        <button
                            onClick={() => router.push(`/events/${params.slug}/tickets`)}
                            className="flex w-full items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-base font-semibold text-gray-900 transition hover:bg-gray-200"
                        >
                            <HiTicket className="h-5 w-5" />
                            Get Tickets
                        </button>
                    </div>
                </div>
            </div>

            <Mobilenav />
        </main>
    );
};

export default EventDetailPage;

