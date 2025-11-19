"use server";

import Sidebar from "@/components/Sidebar";
import Mobilenav from "@/components/Mobilenav";
import HelpCenterClient from "@/components/HelpCenterClient";

const HelpCenterPage = () => {
  return (
    <div className="relative min-h-screen bg-[#040404] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.1),_transparent_60%)]" />
      <div className="relative z-10 flex flex-col lg:flex-row">
        <Sidebar />
        <HelpCenterClient />
      </div>
      <Mobilenav />
    </div>
  );
};

export default HelpCenterPage;
