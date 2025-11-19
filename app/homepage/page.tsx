import type { Metadata } from "next";
import CardGrid from "@/components/CardGrid";
import ClientSideFeatures from "@/components/ClientSideFeatures";
import HowWeHelp from "@/components/HowWeHelp";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Eventie | Discover, plan, and scale unforgettable events",
  description:
    "Search curated experiences, manage registrations, and run production-ready events with Eventie’s collaborative tooling.",
  openGraph: {
    title: "Eventie | Discover, plan, and scale unforgettable events",
    description:
      "Search curated experiences, manage registrations, and run production-ready events with Eventie’s collaborative tooling.",
    url: "https://eventie.app",
    type: "website",
  },
};

const HomePage = () => (
  <main className="bg-black text-white min-h-screen">
    <ClientSideFeatures />
    <CardGrid />
    <HowWeHelp />
    <Testimonials />
    <CallToAction />
    <Footer />
  </main>
);

export default HomePage;
