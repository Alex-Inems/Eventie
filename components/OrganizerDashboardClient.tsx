"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/context/AuthContext";
import { getDatabase, ref, get } from "firebase/database";
import { MdCheckCircle, MdCreate, MdFolderOpen, MdSearch } from "react-icons/md";
import Image from "next/image";

type Event = {
  id: string;
  title: string;
  organizerId: string;
  totalTicketsSold?: number;
  date: string;
  imageUrl: string;
  description: string;
};

const OrganizerDashboardClient = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("OrganizerDashboardClient must be used within an AuthProvider");
  }

  const { currentUser } = authContext;
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreatedEvents, setShowCreatedEvents] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [userBio, setUserBio] = useState("");

  // Redirect if user is not logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/auth");
    }
  }, [currentUser, router]);

  // Fetch user profile data
  useEffect(() => {
    if (!currentUser) return;

    const fetchUserData = async () => {
      const db = getDatabase();
      const userRef = ref(db, `users/${currentUser.uid}`);

      try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setIsVerified(userData.isVerified || false);
          setUserBio(userData.bio || "No bio available");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Fetch events
  useEffect(() => {
    if (!currentUser) return;

    const fetchEvents = async () => {
      setLoading(true);
      const db = getDatabase();
      const eventsRef = ref(db, "events");

      try {
        const snapshot = await get(eventsRef);
        if (snapshot.exists()) {
          const allEvents: Event[] = [];
          snapshot.forEach((childSnapshot) => {
            const eventData = childSnapshot.val();
            allEvents.push({
              id: childSnapshot.key ?? "",
              title: eventData.title,
              organizerId: eventData.organizerId,
              totalTicketsSold: eventData.totalTicketsSold || 0,
              date: eventData.date || "",
              imageUrl: eventData.imageUrl || "/default-event-image.jpg",
              description: eventData.description || "No description available",
            });
          });
          setEvents(allEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentUser]);

  // Navigation functions
  const viewAttendees = (eventId: string) => {
    router.push(`/events/${encodeURIComponent(eventId)}/attendees`);
  };

  const viewEvent = (eventId: string) => {
    router.push(`/events/${encodeURIComponent(eventId)}`);
  };

  const toggleEventView = () => {
    setShowCreatedEvents(!showCreatedEvents);
  };

  const createEvent = () => {
    router.push("/organizer/create-event");
  };

  // Filter events based on search and organizerId
  const filteredEvents = events.filter((event) => {
    const isMatchingSearchQuery =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.date.toLowerCase().includes(searchQuery.toLowerCase());
    const isCreatedByUser = showCreatedEvents ? event.organizerId === currentUser?.uid : true;
    return isMatchingSearchQuery && isCreatedByUser;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white/30 backdrop-blur-md">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:ml-44 mb-14">
      <h1 className="text-xl font-bold mb-4">My Events</h1>

      {/* Profile Info */}
      <div className="flex items-center space-x-3 mb-6">
        {isVerified && <MdCheckCircle className="text-green-500 text-2xl" />}
        <p className="text-sm text-gray-700">Bio: {userBio}</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <button
          className="shadow-lg flex items-center text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md transition text-sm"
          onClick={createEvent}
        >
          <MdCreate className="mr-2" />
          Create New Event
        </button>
        <button
          className="shadow-lg flex items-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition text-sm"
          onClick={toggleEventView}
        >
          <MdFolderOpen className="mr-2" />
          {showCreatedEvents ? "Show Upcoming Events" : "Show Created Events"}
        </button>
      </div>

      <h2 className="text-lg font-bold mb-4">All Events</h2>

      {/* Search Bar */}
      <div className="mb-6 w-full max-w-md mx-auto">
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            className="w-full py-2 pl-10 pr-4 bg-gray-100 text-gray-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <div key={event.id} className="p-4 bg-white border rounded-lg shadow-lg hover:scale-105 transition">
              <Image src={event.imageUrl} alt={event.title} width={300} height={200} className="rounded-md mb-2" />
              <h2 className="text-lg font-semibold">{event.title}</h2>
              {event.organizerId === currentUser?.uid ? (
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition hover:bg-blue-700 text-xs mt-2"
                  onClick={() => viewAttendees(event.id)}
                >
                  View Attendees
                </button>
              ) : (
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition hover:bg-gray-700 text-xs mt-2"
                  onClick={() => viewEvent(event.id)}
                >
                  View Event
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg font-semibold text-gray-700">No events found</p>
      )}
    </div>
  );
};

export default OrganizerDashboardClient;
