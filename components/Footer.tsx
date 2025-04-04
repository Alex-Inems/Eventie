import { FaXTwitter, FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 border-t border-gray-800 w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Section - Branding */}
          <div>
            <h2 className="text-xl font-semibold text-white">Eventie</h2>
            <p className="text-gray-400 text-sm mt-2">
              Copyright © {new Date().getFullYear()} Eventie. All rights reserved.
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-3">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaXTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaFacebook size={20} />
              </a>
            </div>
          </div>

          {/* Middle Section - Questions */}
          <div>
            <h3 className="font-semibold text-white">Questions</h3>
            <ul className="text-gray-400 text-sm space-y-2 mt-2">
              <li>
                <a href="/help" className="hover:text-white transition">How do I find events?</a>
              </li>
              <li>
                <a href="/help" className="hover:text-white transition">How do I host an event?</a>
              </li>
              <li>
                <a href="/help" className="hover:text-white transition">Is Eventie free?</a>
              </li>
              <li>
                <a href="/help" className="hover:text-white transition">How do I get tickets?</a>
              </li>
            </ul>
          </div>

          {/* Right Section - Relationships */}
          <div>
            <h3 className="font-semibold text-white">Relationships</h3>
            <ul className="text-gray-400 text-sm space-y-2 mt-2">
              <li>
                <a href="/dashboard/organizer" className="hover:text-white transition">Event Organizers</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">Partners & Sponsors</a>
              </li>
              {/* <li>
                <a href="#" className="hover:text-white transition">Affiliate Program</a>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
