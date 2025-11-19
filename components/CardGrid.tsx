import React from "react";
import { IconType } from "react-icons";
import {
  FaHome,
  FaGraduationCap,
  FaBriefcase,
  FaHeart,
  FaSuitcase,
  FaUsers,
  FaShieldAlt,
  FaBuilding,
  FaExclamationTriangle,
  FaCompass,
  FaUserFriends,
} from "react-icons/fa";

interface CardData {
  title: string;
  description: string;
  Icon: IconType;
}

const cardsData: CardData[] = [
  {
    title: "Event discovery",
    description:
      "Personalized recommendations, collaborative wishlists, and location-aware alerts keep your calendar full.",
    Icon: FaHome,
  },
  {
    title: "Seamless registration",
    description:
      "Automated waitlists, multi-currency checkout, and QR-code verification out of the box.",
    Icon: FaGraduationCap,
  },
  {
    title: "Real-time updates",
    description:
      "Push schedule changes, routing notes, and sponsor shoutouts to every ticket holder instantly.",
    Icon: FaHeart,
  },
  {
    title: "Host with ease",
    description:
      "Plan, promote, and reconcile payouts from a single dashboard with audit-ready logs.",
    Icon: FaBriefcase,
  },
  {
    title: "Pan-African reach",
    description:
      "Activate audiences across Lagos, Nairobi, Accra, Jozi and beyond—without spinning up new tooling.",
    Icon: FaSuitcase,
  },
  {
    title: "Community building",
    description:
      "Keep members warm with journeys, DMs, and exclusive drops that live alongside your events.",
    Icon: FaUsers,
  },
  {
    title: "Peace of mind",
    description:
      "Fraud prevention, dispute workflows, and dedicated human support when you need it.",
    Icon: FaShieldAlt,
  },
  {
    title: "Venue access",
    description:
      "Match with verified venues and automate paperwork, insurance, and payouts.",
    Icon: FaBuilding,
  },
];

const problemData: CardData[] = [
  {
    title: "Where are the good events?",
    description:
      "Scattered listings, outdated info, and poor filtering waste hours every week.",
    Icon: FaExclamationTriangle,
  },
  {
    title: "How do I host one?",
    description:
      "From acquiring attendees to balancing budgets, teams juggle eight different tools.",
    Icon: FaCompass,
  },
  {
    title: "Who can I trust?",
    description:
      "Fake listings and last-minute cancellations erode confidence for both attendees and partners.",
    Icon: FaUserFriends,
  },
];

const trustedBy = [
  "AfroTech Labs",
  "Jozi Collective",
  "Vibes In Lagos",
  "DevCon Accra",
  "House Of Art",
];

const CardGrid: React.FC = () => {
  return (
    <section className="w-full bg-black px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-orange-200">
            Why Eventie
          </p>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Everything you need to go from idea to sold-out
          </h2>
          <p className="mt-3 text-gray-400">
            Each feature is designed to remove friction for attendees, partners,
            and internal ops teams.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cardsData.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-white/5 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-white/20"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg text-orange-200">
                <card.Icon />
              </span>
              <h3 className="mt-4 text-xl font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm text-gray-300">{card.description}</p>
            </article>
          ))}

          <article className="rounded-2xl border border-orange-400/30 bg-gradient-to-br from-orange-500/10 via-rose-500/5 to-transparent p-6 lg:col-span-3">
            <p className="text-sm uppercase tracking-[0.4em] text-orange-200">
              Trusted by
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-300">
              {trustedBy.map((brand) => (
                <span key={brand} className="font-semibold tracking-wide">
                  {brand}
                </span>
              ))}
            </div>
          </article>
        </div>

        <div className="mt-20 rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 via-transparent to-white/5 p-8">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-orange-200">
              The gap
            </p>
            <h3 className="mt-4 text-2xl font-semibold">
              The problems Eventie solves
            </h3>
            <p className="mt-3 text-gray-400">
              We listened to hundreds of organizers before shipping a single
              feature.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {problemData.map((problem) => (
              <article
                key={problem.title}
                className="rounded-2xl border border-white/10 bg-black/60 p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-white/10 p-3 text-orange-200">
                    <problem.Icon />
                  </span>
                  <h4 className="text-lg font-semibold">{problem.title}</h4>
                </div>
                <p className="mt-3 text-sm text-gray-300">
                  {problem.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardGrid;
