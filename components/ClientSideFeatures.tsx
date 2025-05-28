"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Use Next.js router
import AuthContext from "@/context/AuthContext"; // Adjust path if needed
import AnimatedGrid from "./AnimatedGridBackground";

const ClientSideFeatures = () => {
  const authContext = useContext(AuthContext);
  const currentUser = authContext?.currentUser; // Safe access

  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-black relative z-10 flex flex-col justify-center items-center text-center h-screen w-screen overflow-hidden text-[#D4D4D4]">
      {/* Background Grid */}
      <AnimatedGrid />

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full flex items-center justify-between p-4 bg-transparent shadow-md">
        <div className="flex items-center gap-8">
          <Link href="/">
            <img 
              src="/images/4.png" 
              alt="Logo" 
              className="h-14 md:h-16 brightness-110 drop-shadow-lg transition-transform transform hover:scale-105"
            />
          </Link>

          <div className="hidden md:flex gap-8">
            <Link href="/events" className="text-[#D4D4D4] hover:text-orange-200 transition">Events</Link>
            <Link href="/profile" className="text-[#D4D4D4] hover:text-orange-200 transition">Profile</Link>
            <Link href="/help" className="text-[#D4D4D4] hover:text-orange-200 transition">Help</Link>
          </div>
        </div>

        <div className="hidden md:flex gap-4">
          {currentUser && (
            <button className="bg-[#171717] text-[#D4D4D4] px-4 py-1 rounded-full border border-orange-100 font-semibold hover:bg-red-600 transition">
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </nav>

      {/* Mobile Menu Content */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#171717] p-4 flex flex-col items-center gap-4 md:hidden">
          <Link href="/events" className="text-[#D4D4D4] hover:text-orange-300 transition">Events</Link>
          <Link href="/profile" className="text-[#D4D4D4] hover:text-orange-300 transition">Profile</Link>
          <Link href="/help" className="text-[#D4D4D4] hover:text-orange-300 transition">Help</Link>
          <button className="bg-[#171717] text-[#D4D4D4] px-4 py-2 rounded-lg font-semibold hover:bg-orange-400 transition">
            Action
          </button>
          {currentUser && (
            <button className="bg-[#171717] text-[#D4D4D4] px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition">
              Logout
            </button>
          )}
        </div>
      )}

      {/* Hero Section */}
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
          className="w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-3/4 max-w-4xl py-2 px-4 shadow-md bg-[#171717] border border-orange-200 rounded-full text-[#D4D4D4] focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </form>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Link
          href="/events"
          prefetch={false}
          className="group bg-[#171717] ml-3 text-orange-300 px-6 py-3 rounded-full font-semibold hover:bg-black hover:text-white border border-orange-100 flex items-center gap-2 transition-all duration-300"
        >
          Discover Events 
          <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
        </Link>

        {currentUser ? (
          <Link
            href="/dashboard/organizer"
            prefetch={false}
            className="group hover:text-orange-300 px-6 py-3 font-semibold text-[#D4D4D4] flex items-center gap-2 transition-all duration-300"
          >
            Start Organizing 
            <span className="group-hover:translate-x-3 group-hover:rotate-[110deg] transition-transform duration-300 inline-block">→</span>
          </Link>
        ) : (
          <Link
            href="/auth"
            prefetch={false}
            className="group hover:text-orange-300 px-6 py-3 hover:rounded-full font-semibold text-[#D4D4D4] mr-3 flex items-center gap-2 transition-all duration-300"
          >
            Login to Organize  
            <span className="group-hover:translate-x-3 group-hover:-rotate-[30deg] transition-transform duration-300 inline-block">→</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ClientSideFeatures;
