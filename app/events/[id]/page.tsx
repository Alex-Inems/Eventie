'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getDatabase, ref, get } from 'firebase/database';
import Image from 'next/image';

type Event = {
  title: string;
  description: string;
  date: string;
  location: string;
  speakers: string[];
  imageUrl: string;
};

const EventDetailPage = ({ params }: { params: { id: string } }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [id, setId] = useState<string | null>(null); // Add local state for id

  // Unwrap params using React.use()
  useEffect(() => {
    const fetchId = async () => {
      const resolvedParams = await params; // Unwrap the params promise
      setId(resolvedParams.id);
    };
    fetchId();
  }, [params]);

  // Fetch event details from Firebase
  const fetchEventDetails = async (eventId: string) => {
    try {
      const db = getDatabase();
      const eventRef = ref(db, `events/${eventId}`); // Adjust to your Firebase structure
      const snapshot = await get(eventRef);

      if (snapshot.exists()) {
        setEvent(snapshot.val());
      } else {
        console.error('Event not found');
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEventDetails(id); // Fetch event if ID is available
    }
  }, [id]);

  if (!event) {
    return <div>Loading...</div>; // Loading state while event data is being fetched
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
      <p className="text-lg text-gray-600 mb-4">{event.date}</p>
      <div className="relative w-full h-64 mb-8">
        <Image 
          src={event.imageUrl || '/images/default-event.jpg'} 
          alt={event.title} 
          layout="fill" 
          objectFit="cover"
        />
      </div>
      <p className="text-xl text-gray-800 mb-6">{event.description}</p>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Speakers</h3>
        <ul>
          {event.speakers && event.speakers.length > 0 ? (
            event.speakers.map((speaker, idx) => (
              <li key={idx} className="text-lg text-gray-700">{speaker}</li>
            ))
          ) : (
            <p>No speakers available for this event.</p>
          )}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Location</h3>
        <p className="text-lg text-gray-700">{event.location}</p>
      </div>

      <button 
        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 mt-8"
        onClick={() => alert('Ticket purchase functionality to be added')}
      >
        Purchase Tickets
      </button>
    </div>
  );
};

export default EventDetailPage;
