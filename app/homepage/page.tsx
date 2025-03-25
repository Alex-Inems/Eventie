import ClientSideFeatures from "@/components/ClientSideFeatures";

export const metadata = {
  title: "Eventify - Discover & Organize Events",
  description: "Find and manage events effortlessly with Eventify.",
  openGraph: {
    title: "Eventify - Your All-in-One Event Management Platform",
    description: "Effortlessly plan, organize, and discover events with Eventify.",
    images: ["/images/slide1.jpg"],
  },
};

const HomePage = () => {
  return (
    <div className="bg-black relative h-screen overflow-hidden text-white flex flex-col justify-center items-center text-center">
      {/* Background animation remains untouched */}
      <div className="absolute inset-0 bg-cover bg-center animate-sliding-bg"></div>

      {/* Client-Side Features (Search, Auth, Buttons) */}
      <ClientSideFeatures />
    </div>
  );
};

export default HomePage;
