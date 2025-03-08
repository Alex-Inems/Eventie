"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import Image from "next/image";
import Link from "next/link";
import { MdEvent, MdFace3, MdPayment } from "react-icons/md";
import { app } from "@/firebaseConfig"; // Ensure Firebase is initialized correctly

// Define Event interface
interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  date: string;
}

const HomePage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const db = getDatabase(app);
    const eventsRef = ref(db, "events");

    const unsubscribe = onValue(eventsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const eventList: Event[] = Object.keys(data).map((key) => ({
          id: key,
          title: data[key].title || "Untitled Event",
          description: data[key].description || "No description available",
          imageUrl: data[key].imageUrl,
          date: data[key].date || new Date().toISOString(),
        }));
        setEvents(eventList);
      } else {
        setEvents([]);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null; // Prevents UI flickering during loading

  // Click handlers for buttons
  const handleNavigate = (path: string) => {
    if (currentUser) {
      router.push(path);
    } else {
      router.push("/auth");
    }
  };

  return (
    <div>
      {/* Hero Section with Sliding Background */}
      <div className="relative h-screen overflow-hidden text-white flex flex-col justify-center items-center text-center">
        {/* Background Sliding Effect */}
        <div className="absolute inset-0 bg-cover bg-center animate-sliding-bg"></div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover. Organize. Experience.
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Your all-in-one platform for effortless event management and discovery.
          </p>

          {/* Search Bar */}
          <div className="flex justify-center gap-4 mb-8">
            <input
              type="text"
              className="px-6 py-3 rounded-lg shadow-md w-1/2 max-w-xl"
              placeholder="Search for events, organizers, or locations"
            />
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleNavigate("/events")}
              className="bg-white text-purple-600 px-6 ml-2 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              Discover Events
            </button>
            <button
              onClick={() => handleNavigate("/dashboard/organizer")}
              className="bg-white text-teal-600 px-6 py-3 mr-2 rounded-lg font-semibold hover:bg-gray-100"
            >
              Start Organizing
            </button>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default HomePage;
