'use client'

import { useRouter } from 'next/navigation';
import { FaUserCircle, FaPlusCircle, FaSignOutAlt, FaQuestionCircle, FaBell } from 'react-icons/fa';
import Image from 'next/image';  // Import the Image component

interface SidebarProps {
  userName: string;
  userProfilePic: string;
  logout: () => void;
}

const Sidebar = ({ userName, userProfilePic, logout }: SidebarProps) => {
  const router = useRouter(); // Use useRouter inside the component

  return (
    <div className="w-full lg:w-44 bg-gray-800 text-white hidden lg:h-screen p-4 flex-col lg:block fixed top-0 left-0">
      <h1 className="text-xl font-semibold mb-4">Welcome, {userName}</h1>
      <div className="space-y-3">
        <button
          className="flex items-center space-x-2 text-white hover:bg-gray-700 py-2 px-3 rounded-md w-full text-sm"
          onClick={() => router.push('/dashboard/organizer')}
        >
          <FaUserCircle />
          <span>My Dashboard</span>
        </button>
        <button
          className="flex items-center space-x-2 text-white hover:bg-gray-700 py-2 px-3 rounded-md w-full text-sm"
          onClick={() => router.push('/organizer/create-event')}
        >
          <FaPlusCircle />
          <span>Create Event</span>
        </button>
        <button
          className="flex items-center space-x-2 text-white hover:bg-gray-700 py-2 px-3 rounded-md w-full text-sm"
          onClick={() => router.push('/profile')}
        >
          <FaUserCircle />
          <span>Edit Profile</span>
        </button>
        <button
          className="flex items-center space-x-2 text-white hover:bg-gray-700 py-2 px-3 rounded-md w-full text-sm"
          onClick={logout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      {/* Bottom Section (Help, Notifications, Profile) */}
      <div className="mt-auto flex flex-col items-center space-y-4">
        <button
          className="flex items-center space-x-2 text-white hover:bg-gray-700 py-2 px-3 rounded-md w-full text-sm"
          onClick={() => router.push('/help')}
        >
          <FaQuestionCircle />
          <span>Help Center</span>
        </button>

        <div className="flex items-center space-x-2 text-white cursor-pointer text-sm">
          <FaBell />
          <span>Notifications</span>
        </div>

        <div className="flex items-center space-x-2 text-white text-sm">
          <Image
            className="w-8 h-8 rounded-full"
            src={userProfilePic || '/default-profile.png'}
            alt="Profile"
            width={32}   // Set the width and height attributes for optimization
            height={32}
          />
          <span>{userName}</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
