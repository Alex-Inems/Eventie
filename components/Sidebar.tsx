"use client";

import { useContext, useState } from "react";
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
import SmartImage from "./SmartImage";
import { HiXMark } from 'react-icons/hi2';

const navLinks = [
  { label: "My Dashboard", icon: MdDashboard, href: "/dashboard/organizer" },
  { label: "Create Event", icon: MdCreate, href: "/organizer/create-event" },
  { label: "Profile", icon: MdSupervisorAccount, href: "/profile" },
  { label: "Help Center", icon: MdHelpCenter, href: "/help" },
];

const Sidebar = () => {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!authContext) {
    return <div className="text-white">Loading...</div>;
  }

  const { currentUser, logout } = authContext;

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
      logout();
    setShowLogoutConfirm(false);
  };

  return (
    <aside className="hidden w-full max-w-xs flex-col overflow-y-auto border-r border-white/10 bg-black/60 p-6 text-white backdrop-blur lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:flex lg:h-screen">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <SmartImage
          priority
          className="h-12 w-12 rounded-2xl object-cover"
          src={currentUser?.photoURL || undefined}
          alt="Profile"
          width={48}
          height={48}
          fallbackSrc="/images/default-profile.jpeg"
        />
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-gray-400">Organizer</p>
          <p className="text-base font-semibold">{currentUser?.displayName || "Eventie Crew"}</p>
        </div>
      </div>

      <nav className="mt-8 flex-1 space-y-2">
        {navLinks.map((link) => (
          <button
            key={link.href}
            onClick={() => router.push(link.href)}
            className="group flex w-full items-center gap-3 rounded-2xl border border-white/5 px-4 py-3 text-sm font-semibold text-gray-300 transition hover:border-white hover:text-white"
          >
            <link.icon className="text-lg" />
            {link.label}
          </button>
        ))}
      </nav>

      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-orange-500/20 via-transparent to-black/80 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-orange-200">Need help?</p>
          <p className="mt-2 text-sm text-gray-200">
            Chat with support or browse the launch checklists.
          </p>
          <button
            className="mt-3 text-sm font-semibold text-white underline"
            onClick={() => router.push("/help")}
          >
            Contact support →
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-gray-300 transition hover:border-white hover:text-white"
        >
          <span className="flex items-center gap-2">
            <MdLogout />
            Logout
          </span>
          <MdNotifications className="text-base text-gray-400" />
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setShowLogoutConfirm(false)}>
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/90 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-orange-200/20 p-2">
                  <MdLogout className="h-6 w-6 text-orange-200" />
                </div>
                <h3 className="text-xl font-semibold">Confirm Logout</h3>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-full p-2 transition hover:bg-white/10"
              >
                <HiXMark className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-6 text-gray-300">
              Are you sure you want to logout? You&apos;ll need to sign in again to access your dashboard.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 rounded-2xl border border-orange-200 bg-orange-200/20 px-4 py-3 text-sm font-semibold text-orange-200 transition hover:bg-orange-200/30"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
