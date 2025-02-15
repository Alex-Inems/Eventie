import { FaUserCircle, FaPlusCircle, FaSignOutAlt } from 'react-icons/fa';

interface MobilenavProps {
  router: any;
  logout: () => void;
}

const Mobilenav = ({ router, logout }: MobilenavProps) => (
  <div className="mt-6 border-t-2 border-gray-200 lg:hidden fixed bottom-0 left-0 right-0 bg-white text-gray-500 p-4 flex justify-around items-center shadow-lg">
    <button onClick={() => router.push('/dashboard/organizer')} className="flex flex-col items-center">
      <FaUserCircle />
      <span className="text-xs">Dashboard</span>
    </button>
    <button onClick={() => router.push('/organizer/create-event')} className="flex flex-col items-center">
      <FaPlusCircle />
      <span className="text-xs">Create</span>
    </button>
    <button onClick={() => router.push('/profile')} className="flex flex-col items-center">
      <FaUserCircle />
      <span className="text-xs">Profile</span>
    </button>
    <button onClick={logout} className="flex flex-col items-center">
      <FaSignOutAlt />
      <span className="text-xs">Logout</span>
    </button>
  </div>
);

export default Mobilenav;
