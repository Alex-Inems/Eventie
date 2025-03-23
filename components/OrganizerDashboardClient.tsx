"use client";

import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/context/AuthContext";
import { getDatabase, ref, get } from "firebase/database";
import { MdCheckCircle, MdCreate, MdFolderOpen, MdSearch } from "react-icons/md";
import Image from "next/image";

type Event = {
  id: string;
  title: string;
  organizerId: string;
  date: string;
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
  const [showCreatedEvents, setShowCreatedEvents] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!currentUser) {
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
            allEvents.push({
              id: childSnapshot.key ?? "",
              title: eventData.title,
              organizerId: eventData.organizerId,
              date: eventData.date || "",
              imageUrl: eventData.imageUrl || "/default-event.jpg",
              description: eventData.description || ""
            });
          });
          setEvents(allEvents);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentUser, router]);

  const filteredEvents = useMemo(() => {
    if (!searchQuery) return events.filter((event) => (showCreatedEvents ? event.organizerId === currentUser?.uid : true));

    return events.filter(({ title, date, description, organizerId }) => {
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       date.includes(searchQuery) ||
       description.toLowerCase().includes(searchQuery.toLowerCase());
      return showCreatedEvents ? matchesSearch && organizerId === currentUser?.uid : matchesSearch;
    });
  }, [events, searchQuery, showCreatedEvents, currentUser]);

  const navigateTo = useCallback((path: string) => router.push(path), [router]);

  return (
    <div className="p-4 lg:ml-44 w-full mb-14">
      <h1 className="text-lg font-semibold mb-4">My Events</h1>

      {isVerified && <MdCheckCircle className="text-green-500 text-lg mb-2" />}

      {/* Buttons */}
      <div className="flex flex-row justify-between gap-2 sm:gap-3 mb-4">
        <button
          className="flex items-center text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md text-sm shadow"
          onClick={() => navigateTo("/organizer/create-event")}
        >
          <MdCreate className="mr-2" />
          Create Event
        </button>
        <button
          className="flex items-center text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-sm shadow"
          onClick={() => setShowCreatedEvents((prev) => !prev)}
        >
          <MdFolderOpen className="mr-2" />
          {showCreatedEvents ? "Show Upcoming Events" : "Show Created Events"}
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 w-full max-w-sm mx-auto">
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            className="w-full py-2 pl-10 pr-3 bg-gray-100 text-gray-700 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Event Cards */}
      {filteredEvents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-2">
          {filteredEvents.map(({ id, title, organizerId, imageUrl, description }) => (
            <div key={id} className="bg-white border rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
              <div className="relative">
                <Image src={imageUrl} alt={title} width={300} height={180} className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>
              <div className="p-4 flex flex-col justify-between ">
                <h2 className="text-sm font-semibold text-gray-800 truncate">{title}</h2>
                <p className="text-sm font-thin text-green-950">{description}</p>
                <button
                  className={`text-white py-2 px-2 rounded-lg shadow-md font-medium transition ${
                    organizerId === currentUser?.uid ? "bg-blue-950 hover:bg-blue-700" : "bg-red-950 hover:bg-red-800"
                  }`}
                  onClick={() => navigateTo(`/events/${encodeURIComponent(id)}/${organizerId === currentUser?.uid ? "attendees" : ""}`)}
                >
                  {organizerId === currentUser?.uid ? "View Attendees" : "View Event"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs font-semibold text-gray-700">No events found</p>
      )}
    </div>
  );
};

export default OrganizerDashboardClient;
