"use client";

import { useContext, useState } from "react";
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

const ClientSideFeatures = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("ClientSideFeatures must be used within an AuthProvider");
  }
  const { currentUser } = authContext;
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter(); // Initialize Next.js router

  return (
    <div className="relative z-10 flex flex-col justify-center items-center text-center h-screen w-screen overflow-hidden">
      {/* Image Slideshow */}
      <div className="absolute inset-0 -z-10">
        {images.map((src, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2, // Smooth fade-in/out
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 12, // Shorter delay for smoother looping
              delay: index * 3, // Staggered delay per image
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={src}
              alt={`Slide ${index}`}
              fill
              className="object-cover w-full h-full"
              priority
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
        <Link href="/events" prefetch={false} className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
          Discover Events
        </Link>

        {currentUser ? (
          <Link href="/dashboard/organizer" prefetch={false} className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Start Organizing
          </Link>
        ) : (
          <Link href="/auth" prefetch={false} className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Login to Organize
          </Link>
        )}
      </div>
    </div>
  );
};

export default ClientSideFeatures;
