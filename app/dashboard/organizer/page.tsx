'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { MdCheckCircle, MdCircleNotifications,  MdCreate,  MdFilter, MdFolderOpen, MdOutlineCreate, MdSearch } from 'react-icons/md';
import Sidebar from '@/components/Sidebar';
import Mobilenav from '@/components/Mobilenav';
import Image from "next/image";
type Event = {
  id: string;
  title: string;
  organizerId: string;
  totalTicketsSold?: number;
  eventDate: string;
  imageUrl: string;
  description: string;
};

const OrganizerDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatedEvents, setShowCreatedEvents] = useState(true);
  const [userName, setUserName] = useState('');
  const [userProfilePic, setUserProfilePic] = useState('');
  const [isVerified, setIsVerified] = useState(false); // Track verification status
  const [userBio, setUserBio] = useState(''); // Store user bio
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        router.push('/auth');
        return;
      }

      setUserName(user.displayName || 'Organizer');
      setUserProfilePic(user.photoURL || '');

      // Fetch verification status and bio from Firebase
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);

      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          setIsVerified(userData.isVerified); // Set verification status
          setUserBio(userData.bio || 'No bio available'); // Set bio from Firebase
        }
      });
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    const fetchEvents = () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        router.push('/auth');
        return;
      }

      const db = getDatabase();
      const eventsRef = ref(db, 'events');

      const unsubscribe = onValue(eventsRef, (snapshot) => {
        // const organizerId = user.uid;

        const allEvents: Event[] = [];
        snapshot.forEach((childSnapshot) => {
          const event = childSnapshot.val() as Omit<Event, 'id'>;
          const eventWithId = {
            id: childSnapshot.key ?? '',
            ...event,
          };
          allEvents.push(eventWithId);
        });

        setEvents(allEvents);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchEvents();
  }, [router]);

  const viewAttendees = (eventId: string) => {
    router.push(`/dashboard/organizer/events/${eventId}/attendees`);
  };

  const toggleEventView = () => {
    setShowCreatedEvents(!showCreatedEvents);
  };

  const createEvent = () => {
    router.push('/organizer/create-event');
  };

  const logout = () => {
    const auth = getAuth();
    auth.signOut().then(() => {
      router.push('/auth');
    });
  };

 
  const filteredEvents = events.filter((event) => {
    const isMatchingSearchQuery = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  event.eventDate.toLowerCase().includes(searchQuery.toLowerCase());

    const isCreatedByUser = showCreatedEvents ? event.organizerId === getAuth().currentUser?.uid : true;

    return isMatchingSearchQuery && isCreatedByUser;
  });

  if (loading) return <div className="flex justify-center items-center h-full"><div className="loader">Loading...</div></div>;

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Left Sidebar */}
      <Sidebar userName={userName} userProfilePic={userProfilePic} logout={logout} />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:ml-44 mb-14">
        <h1 className="text-xl font-bold mb-4">My Events</h1>

        {/* Event Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              className=" shadow-lg flex items-center text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md  transition text-sm"
              onClick={createEvent}
            >
              <MdCreate />
              Create New Event
            </button>

            <button
              className="shadow-lg flex items-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md  transition text-sm"
              onClick={toggleEventView}
            >
              < MdFolderOpen />
              {showCreatedEvents ? 'Show Upcoming Events' : 'Show Created Events'}
            </button>
          </div>
        </div>

        {/* Display Created Events */}
        <h2 className="text-lg font-bold mb-4">All Events</h2>
        
        {/* Search Bar */}
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

        {/* Display User Info with Verification Badge */}
        <div className="flex items-center space-x-2 mb-6">
  <Image
    src={userProfilePic || "/default-profile.png"}
    alt="Profile"
    width={64}
    height={64}
    className="w-16 h-16 rounded-full object-cover shadow-md"
  />
  <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold">{userName}</span>
              {isVerified && <span className='text-blue-700'><MdCheckCircle /></span>}
            </div>
            {/* Bio section */}
            <p className="text-sm text-gray-600 mt-2">{userBio}</p>
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <div key={event.id} className="p-4 bg-white border rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:cursor-pointer">
                <div className="flex items-center">
                <Image
  src={event.imageUrl || "/default-event-image.jpg"}
  alt={event.title}
  width={64}
  height={64}
  className="w-16 h-16 rounded-md object-cover mr-4"
/>
                  <div>
                    <h2 className="text-lg font-semibold">{event.title}</h2>
                    <p className="text-gray-600 text-sm">Total Tickets Sold: {event.totalTicketsSold || 0}</p>
                    <p className="text-gray-400 text-xs">{new Date(event.eventDate).toLocaleDateString()}</p>
                    <p className="text-gray-500 text-xs mt-2">{event.description}</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  {showCreatedEvents && event.organizerId === getAuth().currentUser?.uid && (
                   <button
                   className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition hover:bg-blue-700 text-xs"
                   onClick={() => router.push(`/events/${event.id}/attendees`)}
                 >
                   View Attendees
                 </button>
                  )}

                  {!showCreatedEvents && (
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition hover:bg-green-700 text-xs"
                      onClick={() => router.push(`/events/${event.id}`)}                  >
                      Register
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <p className="text-lg font-semibold text-gray-700 mb-4">No events found</p>
            <p className="text-gray-600 text-sm mb-6">It seems like no events are available at the moment.</p>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <Mobilenav router={router} logout={logout} />
    </div>
  );
};

export default OrganizerDashboard;
