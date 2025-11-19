import Sidebar from "@/components/Sidebar";
import Mobilenav from "@/components/Mobilenav";
import OrganizerDashboardClient from "@/components/OrganizerDashboardClient";

const OrganizerDashboard = () => {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.08),_transparent_60%)]" />
      <div className="relative z-10 flex flex-col lg:flex-row">
        <Sidebar />
        <OrganizerDashboardClient />
      </div>
      <Mobilenav />
    </div>
  );
};

export default OrganizerDashboard;
