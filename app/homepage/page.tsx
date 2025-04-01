"use client";

import { motion } from "framer-motion";
import CardGrid from "@/components/CardGrid";
import ClientSideFeatures from "@/components/ClientSideFeatures";
import HowWeHelp from "@/components/HowWeHelp";

const HomePage = () => {
  return (
    <div className="bg-black relative min-h-screen overflow-hidden text-white flex flex-col justify-center items-center text-center space-y-16">
      {/* Client-Side Features (Search, Auth, Buttons) */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <ClientSideFeatures />
      </motion.div>

      {/* Card Grid Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }} // Delay to stagger effect
        viewport={{ once: true }}
      >
        <CardGrid />
      </motion.div><motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }} // Delay to stagger effect
        viewport={{ once: true }}
      >
        <HowWeHelp/>
      </motion.div>
    </div>
  );
};

export default HomePage;
