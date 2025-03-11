"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/context/AuthContext";
import { getDatabase, ref, onValue } from "firebase/database";
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

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!currentUser) {
      router.replace("/auth");
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (!currentUser) return;

    const db = getDatabase();
    const userRef = ref(db, `users/${currentUser.uid}`);

    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        setIsVerified(userData.isVerified || false);
        setUserBio(userData.bio || "No bio available");
      }
    });
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchEvents = () => {
      const db = getDatabase();
      const eventsRef = ref(db, "events");

      onValue(eventsRef, (snapshot) => {
        const allEvents: Event[] = [];
        snapshot.forEach((childSnapshot) => {
          const eventData = childSnapshot.val();
          allEvents.push({
            id: childSnapshot.key ?? "",
            title: eventData.title,
            organizerId: eventData.organizerId,
            totalTicketsSold: eventData.totalTicketsSold || 0,
            date: eventData.date || "",
            imageUrl: eventData.imageUrl || "/default-event-image.jpeg",
            description: eventData.description || "No description available",
          });
        });
        setEvents(allEvents);
        setLoading(false);
      });
    };

    fetchEvents();
  }, [currentUser]);

  const viewAttendees = (eventId: string) => {
    router.push(`/dashboard/organizer/events/${encodeURIComponent(eventId)}/attendees`);
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

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <button
          className="shadow-lg flex items-center text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md transition text-sm"
          onClick={createEvent}
        >
          <MdCreate />
          Create New Event
        </button>
        <button
          className="shadow-lg flex items-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition text-sm"
          onClick={toggleEventView}
        >
          <MdFolderOpen />
          {showCreatedEvents ? "Show Upcoming Events" : "Show Created Events"}
        </button>
      </div>

      <h2 className="text-lg font-bold mb-4">All Events</h2>

      <div className="mb-6 w-full max-w-md mx-auto">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <MdSearch />
          </div>
          <input
            type="text"
            className="w-full py-2 pl-10 pr-4 bg-gray-100 text-gray-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {currentUser && (
        <div className="flex items-center space-x-2 mb-6">
          <Image
            src={currentUser.photoURL || "/images/default-profile.jpeg"}
            alt="Profile"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover shadow-md"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold">{currentUser.displayName || "Organizer"}</span>
              {isVerified && <MdCheckCircle className="text-blue-700" />}
            </div>
            <p className="text-sm text-gray-600 mt-2">{userBio}</p>
          </div>
        </div>
      )}

      {filteredEvents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="p-4 bg-white border rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:cursor-pointer"
            >
              <Image
                src={event.imageUrl}
                alt={event.title}
                width={64}
                height={64}
                className="w-16 h-16 rounded-md object-cover mr-4"
              />
              <h2 className="text-lg font-semibold">{event.title}</h2>

              {event.organizerId === currentUser?.uid ? (
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition hover:bg-blue-700 text-xs"
                  onClick={() => viewAttendees(event.id)}
                >
                  View Attendees
                </button>
              ) : (
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition hover:bg-gray-700 text-xs"
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
