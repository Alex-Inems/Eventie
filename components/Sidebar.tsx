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

const Sidebar = () => {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <div className="text-white">Loading...</div>;
  }

  const { currentUser, logout } = authContext;

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  return (
    <div className="w-full lg:w-44  transition   border-2 hidden lg:flex flex-col h-screen p-4 fixed top-0 left-0">
      <h1 className="text-xl font-semibold mb-4">
        Welcome, {currentUser?.displayName || "Organizer"}
      </h1>

      {/* Navigation Links */}
      <div className="space-y-3 flex-1">
        <button
          className="flex items-center space-x-2 text-gray-700 hover:text-orange-200 transition py-2 px-3 rounded-md w-full text-sm"
          onClick={() => router.push("/dashboard/organizer")}
        >
          <MdDashboard />
          <span>My Dashboard</span>
        </button>
        <button
          className="flex items-center space-x-2  py-2 px-3 rounded-md w-full text-sm text-gray-700 hover:text-orange-200"
          onClick={() => router.push("/organizer/create-event")}
        >
          <MdCreate />
          <span>Create Event</span>
        </button>
        <button
          className="flex items-center space-x-2  py-2 px-3 rounded-md w-full text-sm text-gray-700 hover:text-orange-200"
          onClick={() => router.push("/profile")}
        >
          <MdSupervisorAccount />
          <span>Edit Profile</span>
        </button>
        <button
          className="flex items-center space-x-2  py-2 px-3 rounded-md w-full text-sm text-gray-700 hover:text-orange-200"
          onClick={handleLogout}
        >
          <MdLogout />
          <span>Logout</span>
        </button>
      </div>

      {/* Bottom Section (Help, Notifications, Profile) */}
      <div className="space-y-4 mt-auto">
        <button
          className="flex items-center space-x-2  py-2 px-3 rounded-md w-full text-sm text-gray-700 hover:text-orange-200"
          onClick={() => router.push("/help")}
        >
          <MdHelpCenter />
          <span>Help Center</span>
        </button>

        <div className="flex items-center space-x-2  cursor-pointer text-sm text-gray-700 hover:text-orange-200">
          <MdNotifications />
          <span>Notifications</span>
        </div>

        <div className="flex items-center space-x-2  text-sm">
          <Image
            priority={true}
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
  );
};

export default Sidebar;
