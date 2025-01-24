import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { MdEvent, MdPayment } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';

const HomePage: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-purple-600 to-teal-500 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Discover. Organize. Experience.</h1>
        <p className="text-lg md:text-xl mb-8">Your all-in-one platform for effortless event management and discovery.</p>
        
        {/* Search Bar */}
        <div className="flex justify-center gap-4 mb-8">
          <input
            type="text"
            className="px-6 py-3 rounded-lg shadow-md w-1/2 max-w-xl"
            placeholder="Search for events, organizers, or locations"
          />
        </div>

        <div className="flex justify-center gap-4">
          <Link href="/events" className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Discover Events
          </Link>
          <Link href="/organizer" className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Start Organizing
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Eventify?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <MdEvent />, title: "Seamless Management", desc: "Create and manage events effortlessly." },
            { icon: <FaUserFriends />, title: "Personalized Discovery", desc: "Find events tailored to your interests." },
            { icon: <MdPayment />, title: "Secure Payments", desc: "Enjoy safe and easy transactions." },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white shadow-lg rounded-lg p-6 text-center">
              <div className="text-purple-600 text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Event Discovery Section */}
      <section className="bg-gray-100 py-16 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Trending Events</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="bg-white shadow-md rounded-lg overflow-hidden">
              <Image 
                src={`/images/event-${idx + 1}.jpg`} 
                alt={`Event ${idx + 1}`} 
                width={400} 
                height={200} 
                className="w-full h-48 object-cover" 
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">Event Title {idx + 1}</h3>
                <p className="text-gray-600">Event details and description go here.</p>
                <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            "Eventify made organizing my events so much simpler!",
            "I discovered amazing events I wouldn’t have known about otherwise.",
            "The ticketing system is seamless and secure. Highly recommend!",
          ].map((testimonial, idx) => (
            <div key={idx} className="bg-white shadow-lg rounded-lg p-6">
              <p className="text-gray-600 italic">“{testimonial}”</p>
              <p className="mt-4 font-semibold">— User {idx + 1}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Eventify. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-4">
          <Link href="/about" className="text-teal-400 hover:underline">
            About
          </Link>
          <Link href="/contact" className="text-teal-400 hover:underline">
            Contact
          </Link>
          <Link href="/privacy" className="text-teal-400 hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-teal-400 hover:underline">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
