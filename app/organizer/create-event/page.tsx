'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDatabase, ref, set } from 'firebase/database'; // Import Realtime Database methods
import { storage } from '@/firebaseConfig'; // Import Firebase storage setup
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'; // Ensure proper imports

const EventCreationForm = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [ticketLink, setTicketLink] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [hostName, setHostName] = useState(''); // Add host name state

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Upload image to Firebase Storage if there's an image
    let imageUrl = '';
    if (image) {
      const imageRef = storageRef(storage, `events/${image.name}`);
      const snapshot = await uploadBytes(imageRef, image);
      // Retrieve the download URL for the uploaded image
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    // Add event data to Realtime Database
    try {
      const db = getDatabase();
      const newEventId = Date.now().toString(); // Unique ID based on timestamp
      const newEvent = {
        title,
        description,
        date: new Date(date).toISOString(),
        location,
        ticketLink,
        imageUrl,
        createdBy: hostName, // Save host name
      };

      // Create a new event entry in the Realtime Database
      await set(ref(db, 'events/' + newEventId), newEvent);

      // Redirect to the events page or the created event page
      router.push('/events');
    } catch (error) {
      console.error("Error creating event: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create an Event</h2>
      
      {/* Host Name Field */}
      <label className="block text-sm font-semibold mb-2">Host Name</label>
      <input 
        type="text" 
        value={hostName} 
        onChange={(e) => setHostName(e.target.value)} 
        className="w-full p-2 border border-gray-300 rounded mb-4" 
        required 
      />

      <label className="block text-sm font-semibold mb-2">Event Title</label>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        className="w-full p-2 border border-gray-300 rounded mb-4" 
        required 
      />

      <label className="block text-sm font-semibold mb-2">Description</label>
      <textarea 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        className="w-full p-2 border border-gray-300 rounded mb-4" 
        required
      />

      <label className="block text-sm font-semibold mb-2">Event Date</label>
      <input 
        type="datetime-local" 
        value={date} 
        onChange={(e) => setDate(e.target.value)} 
        className="w-full p-2 border border-gray-300 rounded mb-4" 
        required
      />

      <label className="block text-sm font-semibold mb-2">Location</label>
      <input 
        type="text" 
        value={location} 
        onChange={(e) => setLocation(e.target.value)} 
        className="w-full p-2 border border-gray-300 rounded mb-4" 
        required
      />

      <label className="block text-sm font-semibold mb-2">Ticket Link</label>
      <input 
        type="url" 
        value={ticketLink} 
        onChange={(e) => setTicketLink(e.target.value)} 
        className="w-full p-2 border border-gray-300 rounded mb-4" 
        required 
      />

      <label className="block text-sm font-semibold mb-2">Event Image (Optional)</label>
      <input 
        type="file" 
        onChange={handleFileChange} 
        className="w-full p-2 border border-gray-300 rounded mb-4" 
      />

      <button type="submit" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700">
        Create Event
      </button>
    </form>
  );
};

export default EventCreationForm;
