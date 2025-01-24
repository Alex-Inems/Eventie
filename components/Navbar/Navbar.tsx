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
    <nav className="bg-red-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-extrabold text-white transition duration-300 hover:opacity-80">
              UpLift
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(prev => !prev)}
              className="text-white focus:outline-none"
            >
              {isOpen ? '✖' : '☰'}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center text-sm space-x-6 ${isOpen ? 'block' : 'hidden'}`}>
            {links.map((link) => (
              <div key={link.name} className="relative ">
                {link.dropdownItems ? (
                  <button
                    className="flex items-center text-sm font-serif text-white transition duration-300 hover:underline hover:underline-offset-4 focus:outline-none"
                    onClick={() => toggleDropdown(link.name)}
                  >
                    {link.icon && <link.icon className="mr-1" />}
                    {link.name}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="flex items-center text-sm text-white transition duration-300 hover:underline hover:underline-offset-4 focus:outline-none"
                    onClick={handleLinkClick}
                  >
                    {link.icon && <link.icon className="mr-1" />}
                    {link.name}
                  </Link>
                )}
                {dropdownOpen === link.name && link.dropdownItems && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    {link.dropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-500 hover:text-white transition duration-300 rounded-md"
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
                <span className="hidden lg:block text-white">{currentUser.displayName || 'User'}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md transition duration-300 hover:bg-red-500"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="px-4 py-2 bg-red-700 text-white border border-white rounded-lg shadow-md transition duration-300 hover:bg-white hover:text-red-700"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="flex flex-col space-y-4 py-4 px-2">
            {links.map((link) => (
              <div key={link.name}>
                {link.dropdownItems ? (
                  <button
                    className="flex items-center text-lg text-white transition duration-300 hover:underline hover:underline-offset-4 focus:outline-none"
                    onClick={() => toggleDropdown(link.name)}
                  >
                    {link.icon && <link.icon className="mr-1" />}
                    {link.name}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="flex items-center text-lg text-white transition duration-300 hover:underline hover:underline-offset-4 focus:outline-none"
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
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-500 hover:text-white transition duration-300 rounded-md"
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
                  className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md transition duration-300 hover:bg-red-500"
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
