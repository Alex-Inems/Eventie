'use client';

import { useEffect } from 'react';
import { getDatabase, ref, set, get } from 'firebase/database';

const UploadEvents = () => {
  const uploadEventsToFirebase = async () => {
    try {
      const response = await fetch('/events.json');
      const events = await response.json();

      if (!Array.isArray(events)) {
        console.error('Invalid events format in JSON file.');
        return;
      }

      const db = getDatabase();
      const eventsRef = ref(db, 'events');

      // Check if events already exist in Firebase
      const snapshot = await get(eventsRef);
      if (snapshot.exists()) {
        console.log('Events already exist in the database. Skipping upload.');
        return;
      }

      // Upload events to Firebase
      events.forEach(async (event) => {
        const eventRef = ref(db, `events/${event.id}`);
        await set(eventRef, event);
      });

      console.log('Events uploaded successfully.');
    } catch (error) {
      console.error('Error uploading events:', error);
    }
  };

  useEffect(() => {
    uploadEventsToFirebase();
  }, []);

  return null; // No UI needed for this component
};

export default UploadEvents;
