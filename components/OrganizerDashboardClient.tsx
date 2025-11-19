"use client";
import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { MdCheckCircle, MdCreate, MdSearch, MdBolt, MdTimeline, MdSend, MdEdit, MdDelete } from "react-icons/md";
import AuthContext from "@/context/AuthContext";
import { getDatabase, ref, get, remove } from "firebase/database";
import SmartImage from "@/components/SmartImage";
import { generateEventSlug } from "@/utils/slug";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HiXMark } from 'react-icons/hi2';

type Speaker = {
  name: string;
  bio?: string;
  photo?: string;
};

type Event = {
  id: string;
  title: string;
  organizerId: string;
  date: string;
  time: string;
  location: string;
  speakers: string[] | Speaker[];
  imageUrl: string;
  description: string;
};

const OrganizerDashboardClient = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error("OrganizerDashboardClient must be used within an AuthProvider");

  const { currentUser } = authContext;
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreatedEvents] = useState(true); // Always show user's events only
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [deleteConfirm, setDeleteConfirm] = useState<{ eventId: string; eventTitle: string } | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      router.push("/auth");
      return;
    }

    const fetchData = async () => {
      const db = getDatabase();
      const userRef = ref(db, `users/${currentUser.uid}`);
      const eventsRef = ref(db, "events");

      try {
        const [userSnapshot, eventsSnapshot] = await Promise.all([get(userRef), get(eventsRef)]);

        if (userSnapshot.exists()) setIsVerified(userSnapshot.val().isVerified || false);

        if (eventsSnapshot.exists()) {
          const allEvents: Event[] = [];
          eventsSnapshot.forEach((childSnapshot) => {
            const eventData = childSnapshot.val();
            const rawImageUrl = eventData.imageUrl;
            const finalImageUrl = rawImageUrl && rawImageUrl.trim() ? rawImageUrl : "/images/slide.jpg";
            
            // Debug logging for image URLs
            if (rawImageUrl) {
              console.log(`Event "${eventData.title}": imageUrl =`, rawImageUrl);
              console.log(`  - Type: ${typeof rawImageUrl}`);
              console.log(`  - Length: ${rawImageUrl.length}`);
              console.log(`  - Starts with https: ${rawImageUrl.startsWith('https://')}`);
            } else {
              console.log(`Event "${eventData.title}": No imageUrl, using fallback`);
            }
            
            allEvents.push({
              id: childSnapshot.key ?? "",
              title: eventData.title,
              organizerId: eventData.organizerId,
              date: eventData.date || "",
              time: eventData.time || "TBD",
              location: eventData.location || "Unknown",
              speakers: eventData.speakers || [],
              imageUrl: finalImageUrl,
              description: eventData.description || "",
            });
          });
          setEvents(allEvents);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, router]);

  const filteredEvents = useMemo(() => {
    const matchesQuery = (event: Event) => {
      const query = debouncedSearchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.time.toLowerCase().includes(query) ||
        event.date.includes(query)
      );
    };

    return events.filter((event) => {
      if (!debouncedSearchQuery) {
        return showCreatedEvents ? event.organizerId === currentUser?.uid : true;
      }
      const matches = matchesQuery(event);
      return showCreatedEvents ? matches && event.organizerId === currentUser?.uid : matches;
    });
  }, [events, debouncedSearchQuery, showCreatedEvents, currentUser]);

  const createdEvents = events.filter((event) => event.organizerId === currentUser?.uid);
  const now = new Date();
  const upcomingEvents = createdEvents.filter((event) => {
    const parsedDate = new Date(event.date);
    return !isNaN(parsedDate.getTime()) && parsedDate >= now;
  });

  const stats = [
    {
      label: "Live events",
      value: createdEvents.length,
      subtext: showCreatedEvents ? "Your productions" : "All events",
    },
    {
      label: "Upcoming",
      value: upcomingEvents.length,
      subtext: "Next 30 days",
    },
    {
      label: "Cities",
      value: new Set(createdEvents.map((event) => event.location)).size || "—",
      subtext: "Active locations",
    },
  ];

  const quickActions = [
    { label: "Create event", icon: MdCreate, action: () => router.push("/organizer/create-event") },
    { label: "Duplicate run", icon: MdTimeline, action: () => router.push("/events") },
    { label: "Send update", icon: MdSend, action: () => router.push("/help") },
  ];

  const navigateTo = useCallback((path: string) => router.push(path), [router]);

  const handleDeleteClick = (eventId: string, eventTitle: string) => {
    setDeleteConfirm({ eventId, eventTitle });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm || !currentUser) return;

    try {
      const db = getDatabase();
      const eventRef = ref(db, `events/${deleteConfirm.eventId}`);
      await remove(eventRef);
      
      // Remove from local state
      setEvents(prevEvents => prevEvents.filter(e => e.id !== deleteConfirm.eventId));
      toast.success(`"${deleteConfirm.eventTitle}" has been deleted successfully`);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event. Please try again.');
      setDeleteConfirm(null);
    }
  };

  const handleEditEvent = (eventId: string) => {
    router.push(`/organizer/create-event?edit=${eventId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-sm text-gray-400">
        Syncing your events...
      </div>
    );
  }

  return (
    <section className="flex-1 px-4 py-10 lg:ml-[320px] lg:px-12">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-black/60 to-black/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Workspace</p>
            <h1 className="mt-2 text-3xl font-semibold">
              {currentUser?.displayName || "Organizer"}, here’s your mission control.
            </h1>
            <p className="mt-2 text-sm text-gray-300">
              Track performance, prep new launches, and keep every stakeholder aligned.
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-black/60 px-4 py-2 text-sm text-gray-200">
            <span className="flex items-center gap-2">
              {isVerified && <MdCheckCircle className="text-green-400" />} Verified organizer
            </span>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-white/10 bg-black/50 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-gray-400">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.subtext}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={action.action}
            className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/60 px-4 py-3 text-left text-sm font-semibold text-gray-200 transition hover:border-white"
          >
            <span>{action.label}</span>
            <MdBolt className="text-lg text-orange-300" />
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/60 p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <MdSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by title, venue, date..."
            className="w-full rounded-2xl border border-white/10 bg-black/40 py-3 pl-12 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-orange-200 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <article
              key={event.id}
              className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/70 p-4 md:flex-row md:items-center"
            >
              <div className="relative h-40 w-full overflow-hidden rounded-2xl md:h-28 md:w-56">
                <SmartImage 
                  src={event.imageUrl} 
                  alt={event.title} 
                  fill 
                  className="object-cover"
                  fallbackSrc="/images/slide.jpg"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  {event.organizerId === currentUser?.uid && (
                    <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-gray-300">
                      Yours
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-300 line-clamp-2">{event.description}</p>
                <p className="text-xs text-gray-400">
                  {event.date || "No date"} · {event.time} · {event.location}
                </p>
                {event.speakers && event.speakers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Speakers:</span>
                    <div className="flex -space-x-2">
                      {event.speakers.slice(0, 3).map((speaker, idx) => {
                        const speakerName = typeof speaker === 'string' ? speaker : speaker.name;
                        const speakerPhoto = typeof speaker === 'object' && speaker.photo ? speaker.photo : null;
                        return (
                          <div key={idx} className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-black/70">
                            {speakerPhoto ? (
                              <SmartImage
                                src={speakerPhoto}
                                alt={speakerName}
                                fill
                                className="object-cover"
                                fallbackSrc="/images/default-profile.jpeg"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-white/10 text-xs text-gray-400">
                                {speakerName.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {event.speakers.length > 3 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black/70 bg-white/10 text-xs text-gray-400">
                          +{event.speakers.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 md:items-end">
                {event.organizerId === currentUser?.uid && (
                  <div className="flex gap-2">
                    <button
                      className="group flex items-center gap-2 rounded-2xl border border-orange-200/30 bg-orange-200/10 px-4 py-2.5 text-sm font-semibold text-orange-200 transition-all hover:border-orange-200 hover:bg-orange-200/20"
                      onClick={() => handleEditEvent(event.id)}
                      title="Edit event"
                    >
                      <MdEdit className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      className="group flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition-all hover:border-red-500 hover:bg-red-500/20"
                      onClick={() => handleDeleteClick(event.id, event.title)}
                      title="Delete event"
                    >
                      <MdDelete className="h-4 w-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                )}
                <button
                  className="w-full rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-white md:w-auto"
                  onClick={() => {
                    const slug = generateEventSlug(event.title || 'event', event.id);
                    navigateTo(
                      event.organizerId === currentUser?.uid
                        ? `/events/${slug}/attendees`
                        : `/events/${slug}`
                    );
                  }}
                >
                  {event.organizerId === currentUser?.uid ? "View attendees" : "View event"}
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-white/20 bg-black/40 p-10 text-center">
            <p className="text-base font-semibold text-white">No events found</p>
            <p className="mt-2 text-sm text-gray-400">
              Launch something new or adjust your filters to see more activity.
            </p>
            <button
              onClick={() => router.push("/organizer/create-event")}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white"
            >
              <MdCreate />
              Start an event
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-black/90 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-red-500/20 p-2">
                  <MdDelete className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold">Delete Event</h3>
              </div>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-full p-2 transition hover:bg-white/10"
              >
                <HiXMark className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-2 text-gray-300">
              Are you sure you want to delete <span className="font-semibold text-white">&quot;{deleteConfirm.eventTitle}&quot;</span>?
            </p>
            <p className="mb-6 text-sm text-red-400">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 rounded-2xl border border-red-500 bg-red-500/20 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/30"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default OrganizerDashboardClient;
