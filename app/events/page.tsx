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
  const eventsPerPage = 8;

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
        setFilteredEvents(eventsArray);
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
    setCurrentPage(1);
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
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-gray-300 mb-8">Discover Events</h1>

{/* Search Box */}
<div className="flex justify-center mb-6">
  <div className="relative w-full max-w-2xl">
    <input
      type="text"
      placeholder="Search for events..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-full shadow-sm text-base bg-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
    />
    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
      🔍
    </span>
  </div>
</div>
      {filteredEvents.length === 0 ? (
        <p className="text-center text-gray-600 text-sm">No events found. Try searching for something else.</p>
      ) : (
        <>
          {/* Event Grid */}
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
            {currentEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-200 hover:scale-[1.03] hover:shadow-lg"
              >
                <Image
                  src={event.imageUrl || '/images/default-event.jpg'}
                  alt={event.title || 'Event'}
                  width={300}
                  height={150}
                  className="w-full h-36 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-800 mb-1 truncate">
                    {event.title || 'Untitled Event'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {event.description ? event.description.slice(0, 80) + '...' : 'No description available.'}
                  </p>
                  <Link
  href={`/events/${event.id}`}
  className="block mx-auto w-1/2 text-center text-sm font-medium text-white bg-red-900 py-1 rounded-md hover:bg-red-800 transition"
>
  Learn More
</Link>

                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === idx + 1
                      ? 'bg-slate-500 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                  }`}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventsList;
