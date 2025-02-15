'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

// Define the attendee type
type Attendee = {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  quantity: number;
};

const AttendeesPage = () => {
  // Extract event ID from the URL using `useParams` hook
  const { id: eventId } = useParams();

  // State to hold the list of attendees, explicitly typed as an array of Attendee
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  // State to manage loading state
  const [loading, setLoading] = useState(true);

  // Fetch attendees for the event when the component mounts
  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        // Reference to the 'purchases' subcollection for the specific event
        const purchasesRef = collection(db, `events/${eventId}/purchases`);
        // Fetch all documents from the purchases collection
        const snapshot = await getDocs(purchasesRef);

        // Map over the documents and add their ID to the data
        const attendeeList = snapshot.docs.map((doc) => ({
          id: doc.id, // Document ID
          ...doc.data(), // Spread document data
        })) as Attendee[]; // Assert the type as Attendee[]

        // Update state with the fetched attendee list
        setAttendees(attendeeList);
      } catch (error) {
        // Log any errors that occur during the fetch
        console.error('Error fetching attendees:', error);
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [eventId]); // Re-run the effect whenever the `eventId` changes

  // Show a loading state while attendees are being fetched
  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Attendees</h1>
      {attendees.length > 0 ? (
        // Display attendees in a table format
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Ticket Type</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((attendee) => (
              <tr key={attendee.id}>
                <td className="border border-gray-300 px-4 py-2">{attendee.name}</td>
                <td className="border border-gray-300 px-4 py-2">{attendee.email}</td>
                <td className="border border-gray-300 px-4 py-2">{attendee.ticketType}</td>
                <td className="border border-gray-300 px-4 py-2">{attendee.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        // Message displayed if no attendees are found
        <p>No attendees found.</p>
      )}
    </div>
  );
};

export default AttendeesPage;
