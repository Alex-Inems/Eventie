'use client';

import { use, useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { realtimeDb } from '@/firebaseConfig';
import { toast } from 'react-toastify';
import Papa from 'papaparse';
import Sidebar from '@/components/Sidebar';
import Mobilenav from '@/components/Mobilenav';
import { extractIdFromSlug } from '@/utils/slug';

type Attendee = {
    username: string;
    email: string;
    ticketType: string;
    reference: string;
    dateTime: string;
    id: string;
};

const AttendeesPage = ({ params }: { params: Promise<{ slug: string }> }) => {
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [loading, setLoading] = useState(true);

    const { slug } = use(params);
    const eventId = extractIdFromSlug(slug);

    useEffect(() => {
        const fetchAttendees = async () => {
            const attendeeRef = ref(realtimeDb, `events/${eventId}/attendees`);
            try {
                const snapshot = await get(attendeeRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const attendeesArray = Object.keys(data).map((key) => ({
                        id: key,
                        ...data[key],
                    }));

                    setAttendees(attendeesArray);
                } else {
                    toast.info('No attendees found for this event');
                }
            } catch (error) {
                console.error('Error fetching attendees:', error);
                toast.error('Failed to fetch attendees');
            } finally {
                setLoading(false);
            }
        };

        fetchAttendees();
    }, [eventId]);

    const downloadCSV = () => {
        if (attendees.length === 0) {
            toast.info('No attendees to download');
            return;
        }

        const csvData = attendees.map((attendee) => ({
            Username: attendee.username,
            Email: attendee.email,
            TicketType: attendee.ticketType,
            Reference: attendee.reference,
            DateTime: new Date(attendee.dateTime).toLocaleString(),
        }));

        const csv = Papa.unparse(csvData);

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Attendees_${eventId}_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#040404]">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-orange-200" />
            </div>
        );
    }

    return (
        <main className="relative min-h-screen bg-[#040404] text-white">
            <Sidebar />
            <div className="lg:ml-[320px] px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className="text-3xl font-semibold">Event Attendees</h1>
                        {attendees.length > 0 && (
                            <button
                                onClick={downloadCSV}
                                className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
                            >
                                Download CSV
                            </button>
                        )}
                    </div>

                    {attendees.length > 0 ? (
                        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/70">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b border-white/10 bg-white/5">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.35em] text-gray-400">
                                                Username
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.35em] text-gray-400">
                                                Email
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.35em] text-gray-400">
                                                Ticket Type
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.35em] text-gray-400">
                                                Reference
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.35em] text-gray-400">
                                                Date-Time
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendees.map((attendee) => (
                                            <tr key={attendee.id} className="border-b border-white/5 transition hover:bg-white/5">
                                                <td className="px-6 py-4">{attendee.username}</td>
                                                <td className="px-6 py-4 text-gray-300">{attendee.email}</td>
                                                <td className="px-6 py-4 text-gray-300">{attendee.ticketType}</td>
                                                <td className="px-6 py-4 text-gray-300">{attendee.reference}</td>
                                                <td className="px-6 py-4 text-gray-300">
                                                    {new Date(attendee.dateTime).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-white/10 bg-black/70 p-12 text-center">
                            <p className="text-lg text-gray-400">No attendees registered yet</p>
                        </div>
                    )}
                </div>
            </div>
            <Mobilenav />
        </main>
    );
};

export default AttendeesPage;

