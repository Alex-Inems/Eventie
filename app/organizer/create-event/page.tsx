'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDatabase, ref, set } from 'firebase/database';
import { storage } from '@/firebaseConfig';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import Sidebar from '@/components/Sidebar';
import Mobilenav from '@/components/Mobilenav';
import { AiOutlineFileImage } from 'react-icons/ai';
import Image from 'next/image';

const EventCreationForm = () => {
  const router = useRouter();
  
  const [user, setUser] = useState<{ name: string | null; photoURL: string | null } | undefined>(undefined);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [hostName, setHostName] = useState('');
  const [tickets, setTickets] = useState<{ type: string; price: string; quantity: string }[]>([{ type: '', price: '', quantity: '' }]);
  const [ticketTypes, setTicketTypes] = useState<string[]>([]);
  const [currentSection, setCurrentSection] = useState(1); // 1 for Event Details, 2 for Date/Frequency/Location, 3 for Guests/Tickets




  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName ?? null, // Convert null to undefined
        photoURL: currentUser.photoURL ?? null,
      });
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleTicketChange = (index: number, field: 'type' | 'price' | 'quantity', value: string) => {
    const updatedTickets = [...tickets];
    updatedTickets[index][field] = value;
    setTickets(updatedTickets);
  };

  const addTicket = () => {
    setTickets([...tickets, { type: '', price: '', quantity: '' }]);
  };

  const removeTicket = (index: number) => {
    const updatedTickets = tickets.filter((_, i) => i !== index);
    setTickets(updatedTickets);
  };

  const handleNextSection = () => {
    if (currentSection < 3) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error('User not authenticated');
      return;
    }

    let imageUrl = '';
    if (image) {
      const imageRef = storageRef(storage, `events/${image.name}`);
      const snapshot = await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    try {
      const db = getDatabase();
      const newEventId = Date.now().toString();
      const newEvent = {
        title,
        description,
        date: new Date(date).toISOString(),
        location,
        imageUrl,
        createdBy: hostName,
        tickets,
        ticketTypes,
        organizerId: user.uid,
      };

      await set(ref(db, `events/${newEventId}`), newEvent);
      router.push('/dashboard/organizer');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  // Provide fallback for user name and photo URL
  const userName = user?.name || 'Guest';
  const userProfilePic = user?.photoURL || '/default-avatar.png';

  return (
    <div className="flex lg:bg-gray-900  mb-12">
      <Sidebar userName="Organizer" userProfilePic="" logout={() => {}} />

      <div className="flex-1 p-6 lg:p-8 bg-white lg:mr-24 shadow-lg rounded-lg mx-auto mt-10 max-w-4xl w-full">
        <Mobilenav router={router} logout={() => {}} />

        {user && (
          <div className="flex items-center mb-8">
          <Image
            src={userProfilePic}
            alt="User"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full mr-4"
          />
          <h2 className="text-2xl font-bold text-gray-800">Welcome, {userName}!</h2>
        </div>
        )}

        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Create Your Event</h3>

        <form onSubmit={handleSubmit} className="center ml-5 text-purple-950">
          {/* Event Details Section */}
          {currentSection === 1 && (
            <>
              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700 mb-2">Host Name</label>
                <input
                  type="text"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  className="w-full py-2 px-4 border-b-2 border-gray-300 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700 mb-2">Event Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full py-2 px-4 border-b-2 border-gray-300 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full py-2 px-4 border-b-2 border-gray-300 focus:outline-none focus:border-indigo-500"
                  rows={4}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700 mb-2">Event Date</label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full py-2 px-4 border-b-2 border-gray-300 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg text-black font-medium  mb-2">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full py-2 px-4 border-b-2 border-gray-300 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700">Upload Image</label>
                <div className="flex items-center gap-3 border p-2 rounded-md">
                  <AiOutlineFileImage />
                  <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
                </div>
              </div>
              <button
                type="button"
                onClick={handleNextSection}
                className="w-auto bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 mt-4"
              >
                Next
              </button>
            </>
          )}

          {/* Date, Frequency, and Location Section */}
          {currentSection === 2 && (
            <>
              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700 mb-2">Event Date</label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full py-2 px-4 border-b-2 border-gray-300 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full py-2 px-4 border-b-2 border-gray-300 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousSection}
                  className="w-auto bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 mt-4"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextSection}
                  className="w-auto bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 mt-4"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Guests and Ticket Types Section */}
          {currentSection === 3 && (
            <>
              <h4 className="text-xl font-semibold text-gray-700 mb-4">Ticket Details</h4>
              <div className="flex flex-wrap gap-4 mb-6">
                {['Free', 'Paid', 'VIP'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={type}
                      onChange={() => setTicketTypes((prev) => [...prev, type])}
                    />
                    <span>{type}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4">
                {tickets.map((ticket, index) => (
                  <div key={index} className="flex flex-col gap-4">
                    <input
                      type="text"
                      placeholder="Ticket Type"
                      value={ticket.type}
                      onChange={(e) => handleTicketChange(index, 'type', e.target.value)}
                      className="w-full py-2 px-4 border-b-2 border-gray-300 focus:outline-none focus:border-indigo-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Price"
                      value={ticket.price}
                      onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                      className="w-full py-2 px-4 border-b-2 border-gray-300 focus:outline-none focus:border-indigo-500"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={ticket.quantity}
                      onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                      className="w-full py-2 px-4 border-b-2 border-gray-300 focus:outline-none focus:border-indigo-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeTicket(index)}
                      className="text-red-600 mt-2"
                    >
                      Remove Ticket
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addTicket}
                className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 mt-4"
              >
                Add Another Ticket
              </button>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handlePreviousSection}
                  className="w-auto bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-auto bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default EventCreationForm;
