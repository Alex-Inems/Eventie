'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { auth } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { links } from '@/types/commonTypes';
import Image from 'next/image';

const Navbar = () => {
  const { currentUser } = useAuth();
  console.log('Current User in Navbar:', currentUser);

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, []);

  const handleLinkClick = useCallback(() => {
    setDropdownOpen(null); // Close dropdown
    setIsOpen(false); // Close mobile menu
  }, []);

  const toggleDropdown = (name: string) => {
    setDropdownOpen(prev => (prev === name ? null : name)); // Toggle dropdown
  };

  return (
    <nav className="md:hidden bg-transparent  shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(prev => !prev)}
              className="text-gray-800 focus:outline-none"
            >
              {isOpen ? '✖' : '☰'}
            </button>
          </div>

          {/* Logo and Greeting (Center) */}
          <div className="flex-grow text-center">
            <Link href="/" className="text-xl font-bold text-gray-500 transition duration-300 hover:opacity-80">
              Eventify
            </Link>
            {currentUser && (
              <div className="text-black font-bold ">
                Hi, {currentUser.displayName || 'User'}
              </div>
            )}
          </div>

          {/* Notification Icon (Right) */}
          <div className="flex items-center space-x-4">
            <button className="text-white">
              {/* Replace with your notification icon */}
              🔔
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (Visible only on mobile) */}
      {isOpen && (
        <div className="md:hidden">
          <div className="flex flex-col space-y-4 py-4 px-2">
            {links.map((link) => (
              <div key={link.name}>
                {link.dropdownItems ? (
                  <button
                    className="flex items-center text-lg text-white transition duration-300 hover:text-purple-400 focus:outline-none"
                    onClick={() => toggleDropdown(link.name)}
                  >
                    {link.icon && <link.icon className="mr-1" />}
                    {link.name}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="flex items-center text-lg text-white transition duration-300 hover:text-purple-400 focus:outline-none"
                    onClick={handleLinkClick}
                  >
                    {link.icon && <link.icon className="mr-1" />}
                    {link.name}
                  </Link>
                )}
                {dropdownOpen === link.name && link.dropdownItems && (
                  <div className="pl-4 mt-2 space-y-2">
                    {link.dropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-600 hover:text-white transition duration-300 rounded-md"
                        onClick={handleLinkClick}
                      >
                        {item.icon && <item.icon className="mr-1 inline" />}
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {currentUser ? (
              <div className="flex items-center space-x-4">
                {currentUser.photoURL && (
                  <Image
                    src={currentUser.photoURL}
                    alt="Profile Picture"
                    className="rounded-full"
                    width={40}
                    height={40}
                    priority
                  />
                )}
                <span className="text-white">{currentUser.displayName || 'User'}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md transition duration-300 hover:bg-purple-500"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md transition duration-300 hover:bg-green-500"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
