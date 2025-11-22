'use client';
import { useEffect, useState, useMemo } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { HiMiniMagnifyingGlass, HiCalendar, HiMapPin } from 'react-icons/hi2';
import SmartImage from '@/components/SmartImage';
import { generateEventSlug } from '@/utils/slug';

interface Event {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  date?: string;
  location?: string;
  time?: string;
  organizerId?: string;
}

const EventsList = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [firebaseEvents, setFirebaseEvents] = useState<Event[]>([]);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const eventsPerPage = 12;

  const categories = ['all', 'concerts', 'tech', 'food', 'workshops', 'networking'];

  // Fetch Firebase events
  const fetchFirebaseEvents = async () => {
    try {
      const db = getDatabase();
      const eventsRef = ref(db, 'events');
      const snapshot = await get(eventsRef);

      if (snapshot.exists()) {
        const firebaseData: Record<string, Omit<Event, 'id'>> = snapshot.val();
        const eventsArray: Event[] = Object.keys(firebaseData).map((key) => {
          const eventData = firebaseData[key];
          const rawImageUrl = eventData.imageUrl;
          
          // Debug logging for image URLs
          if (rawImageUrl) {
            console.log(`[Events List] Event "${eventData.title}": imageUrl =`, rawImageUrl);
            console.log(`  - Type: ${typeof rawImageUrl}`);
            console.log(`  - Length: ${rawImageUrl.length}`);
            console.log(`  - Starts with https: ${rawImageUrl.startsWith('https://')}`);
          } else {
            console.log(`[Events List] Event "${eventData.title}": No imageUrl found`);
          }
          
          return {
          id: key,
            ...eventData,
            // Ensure imageUrl is properly set (don't override if it exists)
            imageUrl: rawImageUrl && rawImageUrl.trim() ? rawImageUrl : undefined,
          };
        });
        setFirebaseEvents(eventsArray);
      }
    } catch (error) {
      console.error('Error fetching Firebase events:', error);
    }
  };

  useEffect(() => {
    fetchFirebaseEvents();
  }, []);

  // Filter and search events
  const filteredEvents = useMemo(() => {
    let filtered = firebaseEvents;

    // Search filter
    if (localSearchQuery) {
      const query = localSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title?.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query)
      );
    }

    // Category filter (simplified - you can enhance this with actual categories)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((event) => {
        const titleLower = event.title?.toLowerCase() || '';
        return titleLower.includes(selectedCategory);
      });
    }

    return filtered;
  }, [firebaseEvents, localSearchQuery, selectedCategory]);

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date TBD';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Date TBD';
    }
  };

  return (
    <main className="min-h-screen bg-[#040404] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-black via-[#0a0a0a] to-black px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.1),_transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-orange-200">Discover</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl lg:text-6xl">
            Events across Africa
          </h1>
          <p className="mt-5 text-lg text-gray-300">
            Find concerts, meetups, workshops, and experiences that match your vibe.
          </p>

          {/* Search Bar */}
          <form
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
          >
            <div className="relative mx-auto max-w-2xl">
              <HiMiniMagnifyingGlass className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={localSearchQuery}
                onChange={(e) => {
                  setLocalSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search for concerts, meetups, communities..."
                className="w-full rounded-full border border-white/10 bg-white/10 py-4 pl-14 pr-4 text-base text-white placeholder:text-gray-400 focus:border-orange-200 focus:outline-none"
              />
            </div>
          </form>

          {/* Quick Filters */}
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`rounded-full border px-4 py-2 capitalize transition ${selectedCategory === category
                  ? 'border-orange-200 bg-orange-200/10 text-orange-200'
                  : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">No events found</p>
              <p className="mt-2 text-sm text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentEvents.map((event) => {
                  const slug = generateEventSlug(event.title || 'event', event.id);
                  
                  // Debug: Log what imageUrl is being used
                  if (event.imageUrl) {
                    console.log(`[Events List Display] Rendering "${event.title}" with imageUrl:`, event.imageUrl.substring(0, 50) + '...');
                  } else {
                    console.log(`[Events List Display] Rendering "${event.title}" with NO imageUrl, will use fallback`);
                  }
                  
                  return (
                    <Link
                      key={event.id}
                      href={`/events/${slug}`}
                      className="group overflow-hidden rounded-3xl border border-white/10 bg-black/60 transition hover:border-white/20"
                    >
                      <div className="relative h-48 w-full overflow-hidden">
                        <SmartImage
                          src={event.imageUrl || undefined}
                          alt={event.title || 'Event'}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          fallbackSrc="/images/slide4.jpg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      </div>
                      <div className="p-5">
                        <h3 className="mb-2 line-clamp-2 text-lg font-semibold group-hover:text-orange-200 transition">
                          {event.title || 'Untitled Event'}
                        </h3>
                        <p className="mb-4 line-clamp-2 text-sm text-gray-400">
                          {event.description || 'No description available.'}
                        </p>
                        <div className="space-y-2 text-xs text-gray-400">
                          {event.date && (
                            <div className="flex items-center gap-2">
                              <HiCalendar className="h-4 w-4" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <HiMapPin className="h-4 w-4" />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, idx) => {
                    let pageNum;
                    if (totalPages <= 7) {
                      pageNum = idx + 1;
                    } else if (currentPage <= 4) {
                      pageNum = idx + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + idx;
                    } else {
                      pageNum = currentPage - 3 + idx;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${currentPage === pageNum
                          ? 'border-orange-200 bg-orange-200/10 text-orange-200'
                          : 'border-white/10 bg-white/5 text-white hover:border-white/30'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default EventsList;
