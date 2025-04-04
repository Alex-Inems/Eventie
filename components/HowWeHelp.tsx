"use client";

import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import AnimatedGrid from "./AnimatedGridBackground";

interface StepData {
  number: number;
  title: string;
  points: string[];
  buttonText: string;
}

const steps: StepData[] = [
  {
    number: 1,
    title: "Discover Events Instantly",
    points: [
      "Browse curated events across Africa — concerts, tech meetups, fashion shows, and more.",
      "Filter by city, category, or date to find what fits your vibe.",
      "Save your favorites and get notified before they start.",
    ],
    buttonText: "Start Exploring",
  },
  {
    number: 2,
    title: "Register or Host with Ease",
    points: [
      "Register for events with one click — no hassle, no long forms.",
      "Want to host? Set up your event, add details, and publish — all in under 5 minutes.",
      "Manage RSVPs, payments, and updates from your dashboard.",
    ],
    buttonText: "Join or Host",
  },
  {
    number: 3,
    title: "Engage and Grow",
    points: [
      "Get real-time updates and reminders before events.",
      "Connect with attendees or organizers before, during, and after the event.",
      "Build your presence — follow, grow, and stay in the loop on future experiences.",
    ],
    buttonText: "Get Started",
  },
];

const HowWeHelp: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const stepElements = document.querySelectorAll(".step-card");
      stepElements.forEach((step, index) => {
        const rect = step.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2 && rect.bottom > 100) {
          setActiveIndex(index + 1);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full px-4 md:px-10 py-16 text-white flex flex-col items-center overflow-hidden">
      {/* Background Animation (Ensure it's behind but visible) */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <AnimatedGrid />
      </div>

      {/* Content Wrapper (Ensure it's above the animation) */}
      <div className="relative z-10 w-full">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          How We Help
        </h2>

        {/* Steps List */}
        <div className="flex flex-col gap-8">
          {steps.map((step) => (
            <motion.div
              key={step.number}
              className="relative step-card border border-gray-700 bg-black/70 backdrop-blur-md rounded-xl p-6 md:p-10 mx-auto flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: step.number * 0.2 }}
            >
              {/* Background Fading Check Animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-500 to-transparent opacity-20"
                animate={{
                  opacity: activeIndex === step.number ? 0.4 : 0.1,
                  scale: activeIndex === step.number ? 1.1 : 1,
                }}
                transition={{ duration: 0.5 }}
              ></motion.div>

              {/* Step Number (Changes Color on Scroll) */}
              <motion.div
                className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full border-2"
                animate={{ borderColor: activeIndex === step.number ? "#00C896" : "#555" }}
                transition={{ duration: 0.3 }}
                style={{ backgroundColor: "#222" }}
              >
                <span className="text-white text-lg font-bold">{step.number}</span>
              </motion.div>

              {/* Left: Step Text */}
              <div className="flex-1 relative">
                <h3 className="text-xl md:text-2xl font-semibold mb-4">{step.title}</h3>
                <ul className="text-gray-400 space-y-2">
                  {step.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <FaCheckCircle className="text-white text-lg" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Step Button */}
              <div className="flex justify-end md:ml-6">
                <button className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg flex items-center gap-2 transition">
                  {step.buttonText} →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowWeHelp;
