"use client";

import { useContext, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AuthContext from "@/context/AuthContext"; // Adjust path if needed

const ClientSideFeatures = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("ClientSideFeatures must be used within an AuthProvider");
  }
  const { currentUser } = authContext;
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname(); // Get current route

  // Navigation handler - forces instant navigation
  const handleNavigation = (target: string, needsAuth: boolean = false) => {
    if (pathname !== target) {
      if (needsAuth && !currentUser) {
        router.push("/auth"); // Redirect to auth page if not logged in
      } else {
        router.push(target);
      }
    }
  };

  return (
    <div className="relative z-10 flex flex-col justify-center items-center text-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Discover. Organize. Experience.
      </h1>
      <p className="text-lg md:text-xl mb-8">
        Your all-in-one platform for effortless event management and discovery.
      </p>

      {/* Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (searchQuery.trim()) {
            router.push(`/events?search=${encodeURIComponent(searchQuery)}`);
          }
        }}
        className="flex justify-center gap-4 mb-8"
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for events..."
          className="px-6 py-3 rounded-lg shadow-md w-1/2 max-w-xl text-black"
        />
        <button
          type="submit"
          aria-label="Search events"
          className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition-all"
        >
          🔍
        </button>
      </form>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleNavigation("/events")}
          className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          aria-label="Discover Events"
        >
          Discover Events
        </button>
        <button
          onClick={() => handleNavigation("/dashboard/organizer", true)}
          className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          aria-label="Start Organizing"
        >
          Start Organizing
        </button>
      </div>
    </div>
  );
};

export default ClientSideFeatures;
