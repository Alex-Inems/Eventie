"use client";

import { MdCreate, MdDashboard, MdLogout, MdSupervisorAccount } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Use auth context for logout

const Mobilenav = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const items = [
    { label: "Dashboard", icon: MdDashboard, action: () => router.push("/dashboard/organizer") },
    { label: "Create", icon: MdCreate, action: () => router.push("/organizer/create-event") },
    { label: "Profile", icon: MdSupervisorAccount, action: () => router.push("/profile") },
    { label: "Logout", icon: MdLogout, action: logout },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 z-20 flex w-[90%] max-w-md -translate-x-1/2 justify-between rounded-3xl border border-white/10 bg-black/70 px-6 py-3 text-white backdrop-blur lg:hidden">
      {items.map((item) => (
        <button
          key={item.label}
          onClick={item.action}
          className="flex flex-col items-center text-xs font-semibold text-gray-300 transition hover:text-white"
        >
          <item.icon className="text-lg" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Mobilenav;
