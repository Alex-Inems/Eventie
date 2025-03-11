"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/context/AuthContext";
import {
  MdCreate,
  MdDashboard,
  MdSupervisorAccount,
  MdHelpCenter,
  MdLogout,
  MdNotifications,
} from "react-icons/md";
import Image from "next/image";
import Head from "next/head";

const Sidebar = () => {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("Sidebar must be used within an AuthProvider");
  }

  const { currentUser, logout } = authContext;

  return (
    <>
      {/* Preload Links */}
      <Head>
        <link rel="preload" href="/dashboard/organizer" as="document" />
        <link rel="preload" href="/organizer/create-event" as="document" />
        <link rel="preload" href="/profile" as="document" />
        <link rel="preload" href="/help" as="document" />
      </Head>

      <div className="w-full lg:w-44 bg-gray-800 text-white hidden lg:flex flex-col h-screen p-4 fixed top-0 left-0">
        <h1 className="text-xl font-semibold mb-4">
          Welcome, {currentUser?.displayName || "Organizer"}
        </h1>

        {/* Navigation Links */}
        <div className="space-y-3 flex-1">
          <button
            className="flex items-center space-x-2 text-white hover:bg-gray-700 py-2 px-3 rounded-md w-full text-sm"
            onClick={() => router.push("/dashboard/organizer")}
            onMouseEnter={() => router.prefetch("/dashboard/organizer")}
          >
            <MdDashboard />
            <span>My Dashboard</span>
          </button>
          <button
            className="flex items-center space-x-2 text-white hover:bg-gray-700 py-2 px-3 rounded-md w-full text-sm"
            onClick={() => router.push("/organizer/create-event")}
            onMouseEnter={() => router.prefetch("/organizer/create-event")}
          >
            <MdCreate />
            <span>Create Event</span>
          </button>
          <button
            className="flex items-center space-x-2 text-white hover:bg-gray-700 py-2 px-3 rounded-md w-full text-sm"
            onClick={() => router.push("/profile")}
            onMouseEnter={() => router.prefetch("/profile")}
          >
            <MdSupervisorAccount />
            <span>Edit Profile</span>
          </button>
          <button
            className="flex items-center space-x-2 text-white hover:bg-gray-700 py-2 px-3 rounded-md w-full text-sm"
            onClick={logout}
          >
            <MdLogout />
            <span>Logout</span>
          </button>
        </div>

        {/* Bottom Section (Help, Notifications, Profile) */}
        <div className="space-y-4 mt-auto">
          <button
            className="flex items-center space-x-2 text-white hover:bg-gray-700 py-2 px-3 rounded-md w-full text-sm"
            onClick={() => router.push("/help")}
            onMouseEnter={() => router.prefetch("/help")}
          >
            <MdHelpCenter />
            <span>Help Center</span>
          </button>

          <div className="flex items-center space-x-2 text-white cursor-pointer text-sm">
            <MdNotifications />
            <span>Notifications</span>
          </div>

          <div className="flex items-center space-x-2 text-white text-sm">
            <Image
              className="w-8 h-8 rounded-full"
              src={currentUser?.photoURL || "/images/default-profile.jpeg"}
              alt="Profile"
              width={32}
              height={32}
            />
            <span>{currentUser?.displayName || "Organizer"}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
