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
  { title: "Residency", description: "Permanent right to live in a new country, and up to 27 countries through the European Union.", Icon: FaHome },
  { title: "Education", description: "Access to free or subsidized education, from K-12 to bachelors and masters degrees.", Icon: FaGraduationCap },
  { title: "Healthcare", description: "Access to quality health care providers, often for free or heavily subsidized.", Icon: FaHeart },
  { title: "Employment", description: "Access to job markets across multiple countries, without visas or work permits.", Icon: FaBriefcase },
  { title: "Mobility", description: "Visa-free travel to more countries. Shorter immigration lines. Easier border crossings.", Icon: FaSuitcase },
  { title: "Family Rights", description: "Spouses, children, and future generations are often eligible for the same benefits.", Icon: FaUsers },
  { title: "Peace of mind", description: "A backup plan, especially in times of geopolitical instability and uncertainty.", Icon: FaShieldAlt },
  { title: "Property Rights", description: "Buy properties in another country with fewer restrictions.", Icon: FaBuilding },
];

const problemData: CardData[] = [
  { title: "Am I even eligible?", description: "Many people eligible for an ancestral citizenship don’t even know how to confirm their eligibility.", Icon: FaExclamationTriangle },
  { title: "How would I do it?", description: "How long does it take? How much does it cost? What's the next step? The knowledge can feel almost esoteric.", Icon: FaCompass },
  { title: "Who can actually help?", description: "Overwhelmed consulates. Ever-changing policies. 'Professionals' who over-charge, over-promise, and under-deliver.", Icon: FaUserFriends },
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
