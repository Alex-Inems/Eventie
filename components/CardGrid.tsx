import React from "react";
import { IconType } from "react-icons";
import { 
  FaHome, FaGraduationCap, FaBriefcase, FaHeart, 
  FaSuitcase, FaUsers, FaShieldAlt, FaBuilding 
} from "react-icons/fa";
import { FaExclamationTriangle, FaCompass, FaUserFriends } from "react-icons/fa";

interface CardData {
  title: string;
  description: string;
  Icon: IconType;
}

const cardsData: CardData[] = [
  { title: "Event Discovery", description: "Easily find events tailored to your interests — from concerts and conferences to festivals and workshops.", Icon: FaHome },
  { title: "Seamless Registration", description: "Register for events in seconds. No queues. No confusion. Just quick, smooth access.", Icon: FaGraduationCap },
  { title: "Real-Time Updates", description: "Get instant updates on schedule changes, venue directions, and important notifications.", Icon: FaHeart },
  { title: "Host With Ease", description: "Plan, promote, and manage events with built-in tools that streamline every part of the hosting process.", Icon: FaBriefcase },
  { title: "Pan-African Reach", description: "Discover and attend events across African cities with one simple platform — no borders, just connection.", Icon: FaSuitcase },
  { title: "Community Building", description: "Meet like-minded attendees, form communities, and grow your network organically through shared experiences.", Icon: FaUsers },
  { title: "Peace of Mind", description: "Secure transactions, verified hosts, and smooth support so your experience is worry-free.", Icon: FaShieldAlt },
  { title: "Venue Access", description: "Find and book event venues quickly — whether it's a cozy indoor space or a full-scale outdoor arena.", Icon: FaBuilding },
];

const problemData: CardData[] = [
  { title: "Where are the good events?", description: "Its hard to find exciting, local events without scrolling endlessly through scattered platforms.", Icon: FaExclamationTriangle },
  { title: "How do I host one?", description: "From getting attendees to managing logistics, hosting feels overwhelming without the right tools.", Icon: FaCompass },
  { title: "Who can I trust?", description: "Fake listings, last-minute cancellations, and unreliable organizers make it hard to trust online event platforms.", Icon: FaUserFriends },
];

const CardGrid: React.FC = () => {
  return (
    <div className="bg-black w-full px-6 md:px-10 py-16 text-white flex flex-col items-center">
      {/* Title Section */}
      <h2 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12 text-center">What are the benefits?</h2>

      {/* Benefits Card Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 w-full max-w-screen-xl">
        {cardsData.map((card, index) => {
          const isTopRow = index < 4;
          const isBottomRow = index >= 4;

          return (
            <div
              key={index}
              className="relative px-6 py-6 md:px-7 md:py-8 flex flex-col text-left w-full transition-all duration-300"
              style={{
                border: "1px solid rgba(170, 170, 170, 0.3)",
                borderTop: isTopRow ? "none" : "1px solid rgba(170, 170, 170, 0.3)",
                borderBottom: isBottomRow ? "none" : "1px solid rgba(170, 170, 170, 0.3)",
                borderLeft: index % 2 === 0 ? "none" : "1px solid rgba(170, 170, 170, 0.3)",
                borderRight: index % 2 === 1 ? "none" : "1px solid rgba(170, 170, 170, 0.3)",
              }}
            >
              {/* Hover Effect */}
              <div
                className={`absolute inset-0 opacity-0 transition-all duration-300`}
                style={{
                  background: isTopRow
                    ? "linear-gradient(to bottom, rgba(255, 255, 255, 0.08), transparent)"
                    : "linear-gradient(to top, rgba(255, 255, 255, 0.08), transparent)",
                }}
              ></div>

              {/* Icon + Title */}
              <div className="flex items-center gap-2 mb-3">
                <card.Icon className="text-white text-lg" />
                <h3 className="text-sm md:text-base font-semibold">{card.title}</h3>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{card.description}</p>
            </div>
          );
        })}
      </div>

      {/* Problem Section */}
      <div className="mt-16 md:mt-20 w-full max-w-screen-lg text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">What’s the Problem?</h2>
        <p className="text-gray-400 mb-6 md:mb-8">Citizenship through ancestry is a legal right, but barriers can make it difficult to claim.</p>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {problemData.map((problem, index) => (
            <div
              key={index}
              className="p-4 md:p-6 rounded-lg border border-gray-700 text-left bg-black transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <problem.Icon className="text-white text-lg" />
                <h3 className="text-base md:text-lg font-semibold">{problem.title}</h3>
              </div>
              <p className="text-gray-400 text-sm md:text-base">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardGrid;
