'use client';

import { use, useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { realtimeDb } from '@/firebaseConfig';
import { toast } from 'react-toastify';
import Papa from 'papaparse';

type Attendee = {
  username: string;
  email: string;
  ticketType: string;
  reference: string;
  dateTime: string;
  id: string;
};

const AttendeesPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);

  const { id } = use(params);

  useEffect(() => {
    const fetchAttendees = async () => {
      const attendeeRef = ref(realtimeDb, `attendees/${id}`);
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
  }, [id]);

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
    link.download = `Attendees_${id}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  
  // Centered milky spinner while loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white/30 backdrop-blur-md">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Event Attendees</h1>

      {attendees.length > 0 ? (
        <>
          <div className="flex justify-center mb-6">
            <button
              onClick={downloadCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Download CSV
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="w-full min-w-[700px] border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-3 text-left text-sm">Username</th>
                  <th className="border p-3 text-left text-sm">Email</th>
                  <th className="border p-3 text-left text-sm">Ticket Type</th>
                  <th className="border p-3 text-left text-sm">Reference</th>
                  <th className="border p-3 text-left text-sm">Date-Time</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((attendee) => (
                  <tr key={attendee.id} className="hover:bg-gray-50 transition">
                    <td className="border p-3">{attendee.username}</td>
                    <td className="border p-3">{attendee.email}</td>
                    <td className="border p-3">{attendee.ticketType}</td>
                    <td className="border p-3">{attendee.reference}</td>
                    <td className="border p-3">{new Date(attendee.dateTime).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center py-10">No attendees registered yet</div>
      )}
    </div>
  );
};

export default AttendeesPage;
