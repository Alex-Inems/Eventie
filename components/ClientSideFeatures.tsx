"use client";

import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; // Use Next.js router
import AuthContext from "@/context/AuthContext"; // Adjust path if needed

const images = [
  "/images/slide.jpg",
  "/images/slide(2).jpg",
  "/images/slide(3).jpg",
  "/images/slide4.jpg",
];

const DISPLAY_TIME = 5000; // 5 seconds per image
const FADE_DURATION = 2000; // 2 seconds fade effect

const ClientSideFeatures = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("ClientSideFeatures must be used within an AuthProvider");
  }
  const { currentUser } = authContext;
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter(); // Initialize Next.js router
  const [currentIndex, setCurrentIndex] = useState(0);

  // Image slideshow logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, DISPLAY_TIME);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-10 flex flex-col justify-center items-center text-center h-screen w-screen overflow-hidden">
      {/* Image Slideshow */}
      <div className="absolute inset-0 -z-10">
        {images.map((src, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentIndex ? 1 : 0 }}
            transition={{ duration: FADE_DURATION / 1000, ease: "easeInOut" }}
          >
            <Image
              src={src}
              alt={`Slide ${index}`}
              fill
              className="object-cover w-full h-full"
              priority={index === 0} // Load first image eagerly
            />
          </motion.div>
        ))}
      </div>

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
        <Link
          href="/events"
          prefetch={false}
          className="bg-white ml-3 text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
        >
          Discover Events
        </Link>

        {currentUser ? (
          <Link
            href="/dashboard/organizer"
            prefetch={false}
            className="bg-white  text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Start Organizing
          </Link>
        ) : (
          <Link
            href="/auth"
            prefetch={false}
            className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 mr-3"
          >
            Login to Organize
          </Link>
        )}
      </div>
    </div>
  );
};

export default ClientSideFeatures;
