"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/firebaseConfig"; // Ensure Firebase is initialized correctly

const HomePage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null; // Prevents UI flickering during loading

  // Navigate function for buttons
  const handleNavigate = (path: string) => {
    router.push(currentUser ? path : "/auth");
  };

  // Handle search and redirect
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/events?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
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

          {/* Search Bar with Redirection */}
          <form onSubmit={handleSearch} className="flex justify-center gap-4 mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for events..."
              className="px-6 py-3 rounded-lg shadow-md w-1/2 max-w-xl text-black"
            />
           <button
  type="submit"
  className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg"
>
  🔍
</button>

          </form>

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
