'use client';

import { useRouter } from 'next/navigation';
import { 
  MdCreate, MdDashboard, MdSupervisorAccount, 
  MdHelpCenter, MdLogout, MdNotifications 
} from 'react-icons/md';
import Image from 'next/image';

interface SidebarProps {
  userName: string;
  userProfilePic: string;
  logout: () => void;
}

const Sidebar = ({ userName, userProfilePic, logout }: SidebarProps) => {
  const router = useRouter();

  return (
    <div className="w-full lg:w-44 bg-gray-800 text-white hidden lg:flex flex-col h-screen p-4 fixed top-0 left-0">
      <h1 className="text-xl font-semibold mb-4">Welcome, {userName}</h1>
      
      {/* Navigation Links */}
      <div className="space-y-3 flex-1">
        <button
          className="flex items-center space-x-2 text-white hover:bg-gray-700 py-2 px-3 rounded-md w-full text-sm"
          onClick={() => router.push('/dashboard/organizer')}
        >
          <MdDashboard />
          <span>My Dashboard</span>
        </button>
        <button
          className="flex items-center space-x-2 text-white hover:bg-gray-700 py-2 px-3 rounded-md w-full text-sm"
          onClick={() => router.push('/organizer/create-event')}
        >
          <MdCreate />
          <span>Create Event</span>
        </button>
        <button
          className="flex items-center space-x-2 text-white hover:bg-gray-700 py-2 px-3 rounded-md w-full text-sm"
          onClick={() => router.push('/profile')}
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
          onClick={() => router.push('/help')}
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
            src={userProfilePic || '/default-profile.png'}
            alt="Profile"
            width={32}
            height={32}
          />
          <span>{userName}</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
