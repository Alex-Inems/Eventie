"use client";

import { MdCreate, MdDashboard, MdLogout, MdSupervisorAccount } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Use auth context for logout

const Mobilenav = () => {
  const router = useRouter();
  const { logout } = useAuth(); // Get logout function

  return (
    <div className="mt-6 border-t-2 border-gray-200 lg:hidden fixed bottom-0 left-0 right-0 bg-white text-gray-500 p-4 flex justify-around items-center shadow-lg">
      <button onClick={() => router.push("/dashboard/organizer")} className="flex flex-col items-center">
        <MdDashboard />
        <span className="text-xs">Dashboard</span>
      </button>
      <button onClick={() => router.push("/organizer/create-event")} className="flex flex-col items-center">
        <MdCreate />
        <span className="text-xs">Create</span>
      </button>
      <button onClick={() => router.push("/profile")} className="flex flex-col items-center">
        <MdSupervisorAccount />
        <span className="text-xs">Profile</span>
      </button>
      <button onClick={logout} className="flex flex-col items-center">
        <MdLogout />
        <span className="text-xs">Logout</span>
      </button>
    </div>
  );
};

export default Mobilenav;
