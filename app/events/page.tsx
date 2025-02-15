'use client';
import { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import Image from 'next/image';
import Link from 'next/link';

// Define the Event interface
interface Event {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
}

const EventsList = () => {
  const [firebaseEvents, setFirebaseEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  // Fetch Firebase events
  const fetchFirebaseEvents = async () => {
    try {
      const db = getDatabase();
      const eventsRef = ref(db, 'events');
      const snapshot = await get(eventsRef);

      if (snapshot.exists()) {
        const firebaseData: Record<string, Omit<Event, 'id'>> = snapshot.val();
        const eventsArray: Event[] = Object.keys(firebaseData).map((key) => ({
          id: key,
          ...firebaseData[key],
        }));
        setFirebaseEvents(eventsArray);
        setFilteredEvents(eventsArray); // Initialize filtered events
      }
    } catch (error) {
      console.error('Error fetching Firebase events:', error);
    }
  };

  useEffect(() => {
    fetchFirebaseEvents();
  }, []);

  // Filter events based on search query
  useEffect(() => {
    const filtered = firebaseEvents.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
    setCurrentPage(1); // Reset pagination when searching
  }, [searchQuery, firebaseEvents]);

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Discover Events</h1>

      {/* Search Box */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-center text-gray-600">No events found. Try searching for something else.</p>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-8">
            {currentEvents.map((event) => (
              <div key={event.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <Image
                  src={event.imageUrl || '/images/default-event.jpg'}
                  alt={event.title || 'Event'}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{event.title || 'Untitled Event'}</h3>
                  <p className="text-gray-600 mb-4">
                    {event.description ? event.description.slice(0, 100) + '...' : 'No description available.'}
                  </p>
                  <Link
                    href={`/events/${event.id}`}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                className={`px-4 py-2 rounded border ${
                  currentPage === idx + 1
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 border-gray-300'
                }`}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EventsList;
