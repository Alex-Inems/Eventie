'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDatabase, ref, get } from 'firebase/database';
import Image from 'next/image';

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  speakers: string[];
  imageUrl: string;
};

const EventDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const db = getDatabase();
        const eventRef = ref(db, `events/${params.id}`);
        const snapshot = await get(eventRef);

        if (snapshot.exists()) {
          setEvent({ ...snapshot.val(), id: snapshot.key! });
        } else {
          setEvent(null);
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16">
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Event Not Found</h2>
        <p className="text-lg text-gray-600 mb-6">
          We couldn’t find the event you were looking for. It might have been removed or the link might be incorrect.
        </p>
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          onClick={() => router.push('/events')}
        >
          View All Events
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
      <p className="text-lg text-gray-600 mb-4">{new Date(event.date).toLocaleString()}</p>
      <div className="relative w-full h-64 mb-8">
        <Image
          src={event.imageUrl || '/images/default-event.jpg'}
          alt={event.title}
          layout="fill"
          objectFit="cover"
          className="rounded"
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
        onClick={() => router.push(`/events/${event.id}/tickets`)}
      >
        Purchase Tickets
      </button>
    </div>
  );
};

export default EventDetailPage;
