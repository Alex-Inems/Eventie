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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-purple-600 to-teal-500 text-white py-20 px-6 text-center">
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
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Discover Events
          </button>
          <button
            onClick={() => handleNavigate("/dashboard/organizer")}
            className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Start Organizing
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Eventify?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <MdEvent />, title: "Seamless Management", desc: "Create and manage events effortlessly." },
            { icon: <MdFace3 />, title: "Personalized Discovery", desc: "Find events tailored to your interests." },
            { icon: <MdPayment />, title: "Secure Payments", desc: "Enjoy safe and easy transactions." },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white shadow-lg rounded-lg p-6 text-center">
              <div className="text-purple-600 text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Event Discovery Section */}
      <section className="bg-gray-100 py-16 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Trending Events</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.id}
                className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
                onClick={() => handleNavigate(`/events/${event.id}`)}
              >
                <Image
                  src={event.imageUrl || "/images/default-event.jpg"}
                  alt={event.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-gray-600">{event.description}</p>
                  <p className="text-sm text-gray-500">{new Date(event.date).toLocaleString()}</p>
                  <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                    Learn More
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No events available.</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Eventify. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-4">
          <Link href="/about" className="text-teal-400 hover:underline">
            About
          </Link>
          <Link href="/contact" className="text-teal-400 hover:underline">
            Contact
          </Link>
          <Link href="/privacy" className="text-teal-400 hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-teal-400 hover:underline">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
