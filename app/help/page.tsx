'use server';

import Sidebar from '@/components/Sidebar';
import Mobilenav from '@/components/Mobilenav';
import HelpCenterClient from '@/components/HelpCenterClient';

const HelpCenterPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row">
      <Sidebar />
      <HelpCenterClient />
      <Mobilenav />
    </div>
  );
};

export default HelpCenterPage;
