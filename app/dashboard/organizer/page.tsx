import Sidebar from '@/components/Sidebar';
import Mobilenav from '@/components/Mobilenav';
import OrganizerDashboardClient from '@/components/OrganizerDashboardClient';

const OrganizerDashboard = () => {
  return (
    <div className="bg-white flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Client Component */}
      <OrganizerDashboardClient />

      {/* Mobile Navigation */}
      <Mobilenav />
    </div>
  );
};

export default OrganizerDashboard;
