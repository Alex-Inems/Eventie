'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getDatabase, ref, set, get } from 'firebase/database';
import { storage } from '@/firebaseConfig';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import Sidebar from '@/components/Sidebar';
import Mobilenav from '@/components/Mobilenav';
import { MdFileUpload } from 'react-icons/md';
import SmartImage from '@/components/SmartImage';
import { HiCalendar, HiClock, HiMapPin, HiXMark } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventCreationForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editEventId = searchParams.get('edit');

  const [user, setUser] = useState<{ name: string | null; photoURL: string | null } | undefined>(undefined);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hostName, setHostName] = useState('');
  const [tickets, setTickets] = useState<{ type: string; price: string; quantity: string }[]>([{ type: '', price: '', quantity: '' }]);

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

  // Load event data for editing
  useEffect(() => {
    const loadEventForEdit = async () => {
      if (!editEventId) return;

      try {
        const db = getDatabase();
        const eventRef = ref(db, `events/${editEventId}`);
        const snapshot = await get(eventRef);

        if (snapshot.exists()) {
          const eventData = snapshot.val();
          
          // Check if user owns this event
          const auth = getAuth();
          const currentUser = auth.currentUser;
          if (eventData.organizerId !== currentUser?.uid) {
            toast.error('You can only edit your own events');
            router.push('/dashboard/organizer');
            return;
          }

          setTitle(eventData.title || '');
          setDescription(eventData.description || '');
          setDate(eventData.date ? new Date(eventData.date).toISOString().split('T')[0] : '');
          setStartTime(eventData.time || '');
          setEndTime(eventData.endTime || '');
          setLocation(eventData.location || '');
          setHostName(eventData.createdBy || '');
          
          if (eventData.tickets && Array.isArray(eventData.tickets)) {
            setTickets(eventData.tickets);
          } else if (eventData.tickets && typeof eventData.tickets === 'object') {
            // Convert object to array
            setTickets(Object.values(eventData.tickets));
          }
          
          if (eventData.speakers && Array.isArray(eventData.speakers)) {
            const loadedSpeakers = eventData.speakers.map((s: string | { name: string; bio?: string; photo?: string }, idx: number) => {
              const speakerObj = typeof s === 'string' ? { name: s } : s;
              if (speakerObj.photo && typeof speakerObj.photo === 'string') {
                const photoUrl: string = speakerObj.photo;
                setSpeakerPreviews(prev => ({ ...prev, [idx]: photoUrl }));
              }
              return {
                name: speakerObj.name || '',
                bio: speakerObj.bio || '',
                photo: null, // Will be handled separately
                photoUrl: typeof speakerObj.photo === 'string' ? speakerObj.photo : undefined,
              };
            });
            setSpeakers(loadedSpeakers);
          }

          if (eventData.imageUrl) {
            setImagePreview(eventData.imageUrl);
          }
        }
      } catch (error) {
        console.error('Error loading event for edit:', error);
        toast.error('Failed to load event data');
      }
    };

    loadEventForEdit();
  }, [editEventId, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        console.log('Preview created, length:', result.length);
        setImagePreview(result);
      };
      reader.onerror = () => {
        console.error('Error reading file for preview');
        toast.error('Error reading image file');
      };
      reader.readAsDataURL(file);
    } else {
      console.log('No file selected');
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
    
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error('Please sign in to create an event');
      setIsSubmitting(false);
      return;
    }

    // Validate required fields
    if (!title.trim()) {
      toast.error('Please enter an event title');
      setIsSubmitting(false);
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter an event description');
      setIsSubmitting(false);
      return;
    }
    if (!date) {
      toast.error('Please select an event date');
      setIsSubmitting(false);
      return;
    }
    if (!startTime) {
      toast.error('Please select a start time');
      setIsSubmitting(false);
      return;
    }
    if (!endTime) {
      toast.error('Please select an end time');
      setIsSubmitting(false);
      return;
    }
    if (!location.trim()) {
      toast.error('Please select a location');
      setIsSubmitting(false);
      return;
    }
    if (!hostName.trim()) {
      toast.error('Please enter a host name');
      setIsSubmitting(false);
      return;
    }

    // Validate image
    if (!image && !imagePreview) {
      toast.error('Please upload an event cover image');
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = '';
      
      console.log('=== Image Upload Debug ===');
      console.log('Image File object:', image);
      console.log('Image File name:', image?.name);
      console.log('Image File size:', image?.size);
      console.log('Image File type:', image?.type);
      console.log('Image Preview:', imagePreview?.substring(0, 50) + '...');
      console.log('Image Preview type:', typeof imagePreview);
      console.log('Image Preview length:', imagePreview?.length);
      console.log('Is editing:', !!editEventId);
      
      // Priority: Use the File object if available (most reliable)
      if (image && image instanceof File && image.size > 0) {
        console.log('Using File object for upload');
        try {
          // New image uploaded - use unique filename to avoid conflicts
          const timestamp = Date.now();
          const fileExtension = image.name.split('.').pop() || 'jpg';
          const uniqueFileName = `event_${timestamp}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
          const imageRef = storageRef(storage, `events/${uniqueFileName}`);
          console.log('Uploading to path: events/' + uniqueFileName);
          
          // Show upload progress
          const uploadTask = uploadBytes(imageRef, image);
          const snapshot = await uploadTask;
          console.log('Upload complete, getting download URL...');
          
          imageUrl = await getDownloadURL(snapshot.ref);
          console.log('✅ Image uploaded successfully!');
          console.log('✅ Download URL:', imageUrl);
          console.log('✅ URL length:', imageUrl.length);
          console.log('✅ URL starts with https:', imageUrl.startsWith('https://'));
        } catch (uploadError: unknown) {
          const error = uploadError as { code?: string; message?: string };
          console.error('❌ Error uploading image:', uploadError);
          console.error('❌ Error code:', error.code);
          console.error('❌ Error message:', error.message);
          toast.error(`Failed to upload image: ${error.message || 'Unknown error'}`);
          setIsSubmitting(false);
          return;
        }
      } else if (imagePreview) {
        // Fallback: Use preview if it's already a URL
        if (imagePreview.startsWith('http')) {
          imageUrl = imagePreview;
          console.log('Using existing image URL:', imageUrl);
        } else if (imagePreview.startsWith('data:')) {
          // If it's a data URL (from FileReader), convert and upload it
          console.log('Attempting to upload from data URL preview');
          try {
            const response = await fetch(imagePreview);
            const blob = await response.blob();
            console.log('Blob created, size:', blob.size);
            const timestamp = Date.now();
            const uniqueFileName = `${timestamp}_${Math.random().toString(36).substr(2, 9)}.jpg`;
            const imageRef = storageRef(storage, `events/${uniqueFileName}`);
            console.log('Uploading blob to:', uniqueFileName);
            const snapshot = await uploadBytes(imageRef, blob);
            imageUrl = await getDownloadURL(snapshot.ref);
            console.log('Image uploaded from preview successfully!');
            console.log('Download URL:', imageUrl);
          } catch (uploadError) {
            console.error('Error uploading image from preview:', uploadError);
            toast.error('Failed to upload image. Please try again.');
            setIsSubmitting(false);
            return;
          }
        } else {
          console.log('ImagePreview is neither HTTP URL nor data URL:', imagePreview.substring(0, 50));
        }
      } else {
        console.log('No image and no imagePreview available');
      }

      if (!imageUrl || imageUrl.trim() === '') {
        toast.error('Failed to process image. Please upload an image again.');
        setIsSubmitting(false);
        return;
      }

      // Verify imageUrl is a valid URL
      if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        toast.error('Invalid image URL. Please upload the image again.');
        setIsSubmitting(false);
        return;
      }

      // Upload speaker photos
      const processedSpeakers = await Promise.all(
        speakers.map(async (speaker, index) => {
          if (speaker.photo) {
            // Upload new photo
            const photoRef = storageRef(storage, `speakers/${Date.now()}_${speaker.name}_${index}`);
            const snapshot = await uploadBytes(photoRef, speaker.photo);
            const photoUrl = await getDownloadURL(snapshot.ref);
            return {
              name: speaker.name,
              bio: speaker.bio,
              photo: photoUrl,
            };
          } else if (speaker.photoUrl) {
            // Use existing photo URL
            return {
              name: speaker.name,
              bio: speaker.bio,
              photo: speaker.photoUrl,
            };
          } else {
            // No photo
            return {
              name: speaker.name,
              bio: speaker.bio,
            };
          }
        })
      );

      const db = getDatabase();
      const eventId = editEventId || `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const eventData = {
        title: title.trim(),
        description: description.trim(),
        date: new Date(date).toISOString(),
        time: startTime,
        endTime: endTime,
        location: location.trim(),
        imageUrl: imageUrl, // Already validated above, should never be empty
        createdBy: hostName.trim(),
        tickets: tickets.filter(t => t.type && t.price && t.quantity), // Filter out empty tickets
        ticketTypes,
        speakers: processedSpeakers,
        organizerId: user.uid,
      };

      console.log('=== Event Creation Debug ===');
      console.log('Event ID:', eventId);
      console.log('Image URL to save:', imageUrl);
      console.log('Image URL type:', typeof imageUrl);
      console.log('Image URL length:', imageUrl?.length);
      console.log('Full event data:', eventData);
      
      await set(ref(db, `events/${eventId}`), eventData);
      
      // Verify it was saved
      const verifyRef = ref(db, `events/${eventId}/imageUrl`);
      const verifySnapshot = await get(verifyRef);
      console.log('Verified saved imageUrl:', verifySnapshot.val());
      console.log('===========================');
      
      toast.success(editEventId ? 'Event updated successfully!' : 'Event published successfully!');
      router.push('/dashboard/organizer');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Provide fallback for user name and photo URL
  const userName = user?.name || 'Organizer';
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [speakers, setSpeakers] = useState<{ name: string; bio: string; photo: File | null; photoUrl?: string }[]>([]);
  const [speakerPreviews, setSpeakerPreviews] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSpeaker = () => {
    setSpeakers([...speakers, { name: '', bio: '', photo: null }]);
  };

  const removeSpeaker = (index: number) => {
    setSpeakers(speakers.filter((_, i) => i !== index));
  };

  const handleSpeakerChange = (index: number, field: 'name' | 'bio', value: string) => {
    const updatedSpeakers = [...speakers];
    updatedSpeakers[index][field] = value;
    setSpeakers(updatedSpeakers);
  };

  const handleSpeakerPhotoChange = (index: number, file: File | null) => {
    const updatedSpeakers = [...speakers];
    if (file) {
      // Create preview for new file
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...speakers];
        updated[index].photo = file;
        setSpeakers(updated);
        setSpeakerPreviews(prev => ({ ...prev, [index]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      updatedSpeakers[index].photo = null;
    setSpeakers(updatedSpeakers);
      setSpeakerPreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[index];
        return newPreviews;
      });
    }
  };

  const [ticketTypes, setTicketTypes] = useState<string[]>([]);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedTimeField, setSelectedTimeField] = useState<'start' | 'end'>('start');

  useEffect(() => {
    setTicketTypes(tickets.map(ticket => ticket.type));
  }, [tickets]);

  // African cities for location suggestions
  const africanCities = [
    'Lagos, Nigeria',
    'Nairobi, Kenya',
    'Accra, Ghana',
    'Cairo, Egypt',
    'Johannesburg, South Africa',
    'Cape Town, South Africa',
    'Abidjan, Ivory Coast',
    'Dar es Salaam, Tanzania',
    'Addis Ababa, Ethiopia',
    'Kampala, Uganda',
    'Dakar, Senegal',
    'Abuja, Nigeria',
    'Kigali, Rwanda',
    'Lusaka, Zambia',
    'Harare, Zimbabwe',
    'Maputo, Mozambique',
    'Windhoek, Namibia',
    'Gaborone, Botswana',
    'Porto-Novo, Benin',
    'Bamako, Mali',
  ];

  const [locationSearch, setLocationSearch] = useState('');
  const filteredCities = locationSearch
    ? africanCities.filter(city => city.toLowerCase().includes(locationSearch.toLowerCase()))
    : africanCities;

  const handleDateSelect = (selectedDate: string) => {
    setDate(selectedDate);
    setShowDateModal(false);
  };

  const handleTimeSelect = (selectedTime: string) => {
    if (selectedTimeField === 'start') {
      setStartTime(selectedTime);
    } else {
      setEndTime(selectedTime);
    }
    setShowTimeModal(false);
  };

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setLocationSearch('');
    setShowLocationModal(false);
  };

  const openTimeModal = (field: 'start' | 'end') => {
    setSelectedTimeField(field);
    setShowTimeModal(true);
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Generate time options
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(timeString);
    }
  }

  return (
    <main className="relative min-h-screen bg-[#040404] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.08),_transparent_65%)]" />
      <div className="relative z-10 flex flex-col lg:flex-row">
        <Sidebar />
        <section className="flex-1 px-4 py-12 lg:ml-[320px] lg:px-12">
          <div className="rounded-3xl border border-white/10 bg-black/70 p-6">
            {user && (
              <div className="flex items-center gap-4">
                <SmartImage
                  src={user.photoURL || undefined}
                  alt="User"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-2xl object-cover"
                  fallbackSrc="/images/default-profile.jpeg"
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Organizer</p>
                  <h2 className="text-2xl font-semibold">Welcome, {userName}!</h2>
                </div>
              </div>
            )}
            <p className="mt-4 text-sm text-gray-300">
              Build a production-ready event in three quick stages. You can always edit details after
              publishing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {currentSection === 1 && (
              <div className="rounded-3xl border border-white/10 bg-black/70 p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Stage 1 · Identity</p>
                <div className="mt-6 space-y-5">
                  <div>
                    <label htmlFor="event-host-name" className="text-xs uppercase tracking-[0.3em] text-gray-400">Host name</label>
                    <input
                      id="event-host-name"
                      type="text"
                      value={hostName}
                      onChange={(e) => setHostName(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-orange-200 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="event-title" className="text-xs uppercase tracking-[0.3em] text-gray-400">Event title</label>
                    <input
                      id="event-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-orange-200 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="event-description" className="text-xs uppercase tracking-[0.3em] text-gray-400">Description</label>
                    <textarea
                      id="event-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-orange-200 focus:outline-none"
                      rows={4}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="event-cover-image" className="text-xs uppercase tracking-[0.3em] text-gray-400">Cover image</label>
                    {imagePreview ? (
                      <div className="mt-2 space-y-3">
                        <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-white/10">
                          <SmartImage
                            src={imagePreview}
                            alt="Event preview"
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImage(null);
                              setImagePreview(null);
                            }}
                            className="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-white transition hover:bg-black/90"
                          >
                            <HiXMark className="h-4 w-4" />
                          </button>
                        </div>
                        <label htmlFor="event-cover-image" className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 px-4 py-3 text-sm text-gray-300 transition hover:border-orange-200">
                          <MdFileUpload />
                          Change image
                          <input id="event-cover-image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                      </div>
                    ) : (
                      <label htmlFor="event-cover-image" className="mt-2 flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-white/20 px-4 py-3 text-sm text-gray-300 transition hover:border-orange-200">
                      <MdFileUpload />
                      Upload artwork
                      <input id="event-cover-image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextSection}
                    className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
                  >
                    Next: schedule
                  </button>
                </div>
              </div>
            )}

            {currentSection === 2 && (
              <div className="rounded-3xl border border-white/10 bg-black/70 p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Stage 2 · Schedule</p>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="event-date" className="text-xs uppercase tracking-[0.3em] text-gray-400">Event date</label>
                    <button
                      type="button"
                      onClick={() => setShowDateModal(true)}
                      className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-left text-sm text-white transition hover:border-orange-200 focus:border-orange-200 focus:outline-none"
                    >
                      <HiCalendar className="h-5 w-5 text-orange-200" />
                      <span className={date ? 'text-white' : 'text-gray-500'}>
                        {date ? new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Select date'}
                      </span>
                    </button>
                  </div>
                  <div>
                    <label htmlFor="event-location" className="text-xs uppercase tracking-[0.3em] text-gray-400">Location</label>
                    <button
                      type="button"
                      onClick={() => setShowLocationModal(true)}
                      className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-left text-sm text-white transition hover:border-orange-200 focus:border-orange-200 focus:outline-none"
                    >
                      <HiMapPin className="h-5 w-5 text-orange-200" />
                      <span className={location ? 'text-white' : 'text-gray-500'}>
                        {location || 'Select location'}
                      </span>
                    </button>
                  </div>
                  <div>
                    <label htmlFor="event-start-time" className="text-xs uppercase tracking-[0.3em] text-gray-400">Start time</label>
                    <button
                      type="button"
                      onClick={() => openTimeModal('start')}
                      className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-left text-sm text-white transition hover:border-orange-200 focus:border-orange-200 focus:outline-none"
                    >
                      <HiClock className="h-5 w-5 text-orange-200" />
                      <span className={startTime ? 'text-white' : 'text-gray-500'}>
                        {startTime ? formatTime(startTime) : 'Select start time'}
                      </span>
                    </button>
                  </div>
                  <div>
                    <label htmlFor="event-end-time" className="text-xs uppercase tracking-[0.3em] text-gray-400">End time</label>
                    <button
                      type="button"
                      onClick={() => openTimeModal('end')}
                      className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-left text-sm text-white transition hover:border-orange-200 focus:border-orange-200 focus:outline-none"
                    >
                      <HiClock className="h-5 w-5 text-orange-200" />
                      <span className={endTime ? 'text-white' : 'text-gray-500'}>
                        {endTime ? formatTime(endTime) : 'Select end time'}
                      </span>
                    </button>
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePreviousSection}
                    className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSection}
                    className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
                  >
                    Next: tickets
                  </button>
                </div>
              </div>
            )}

            {currentSection === 3 && (
              <div className="rounded-3xl border border-white/10 bg-black/70 p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Stage 3 · Guests</p>
                <div className="mt-6 space-y-6">
                  {speakers.map((speaker, index) => (
                    <div key={index} className="rounded-2xl border border-white/10 p-4">
                      <label htmlFor={`speaker-name-${index}`} className="sr-only">Speaker name</label>
                      <input
                        id={`speaker-name-${index}`}
                        type="text"
                        placeholder="Speaker name"
                        value={speaker.name}
                        onChange={(e) => handleSpeakerChange(index, 'name', e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-orange-200 focus:outline-none"
                        required
                      />
                      <label htmlFor={`speaker-bio-${index}`} className="sr-only">Speaker bio</label>
                      <textarea
                        id={`speaker-bio-${index}`}
                        placeholder="Speaker bio"
                        value={speaker.bio}
                        onChange={(e) => handleSpeakerChange(index, 'bio', e.target.value)}
                        className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-orange-200 focus:outline-none"
                        required
                      />
                      <div className="mt-3 space-y-2">
                        <label htmlFor={`speaker-photo-${index}`} className="text-xs text-gray-400">Speaker photo</label>
                        {(speakerPreviews[index] || speaker.photoUrl) && (
                          <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/10">
                            <SmartImage
                              src={speakerPreviews[index] || speaker.photoUrl}
                              alt={speaker.name || 'Speaker'}
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                handleSpeakerPhotoChange(index, null);
                                const updated = [...speakers];
                                updated[index].photoUrl = undefined;
                                setSpeakers(updated);
                              }}
                              className="absolute -right-2 -top-2 rounded-full bg-red-500/80 p-1 text-white hover:bg-red-500"
                            >
                              <HiXMark className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      <input
                        id={`speaker-photo-${index}`}
                        type="file"
                          accept="image/*"
                        onChange={(e) => handleSpeakerPhotoChange(index, e.target.files?.[0] || null)}
                          className="w-full text-xs text-gray-400"
                      />
                      </div>
                      <button type="button" onClick={() => {
                        removeSpeaker(index);
                        setSpeakerPreviews(prev => {
                          const newPreviews = { ...prev };
                          delete newPreviews[index];
                          return newPreviews;
                        });
                      }} className="mt-3 text-xs text-red-300">
                        Remove speaker
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSpeaker}
                    className="rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white"
                  >
                    Add speaker
                  </button>
                </div>

                <h4 className="mt-8 text-sm uppercase tracking-[0.35em] text-gray-400">Tickets</h4>
                <div className="mt-4 space-y-4">
                  {tickets.map((ticket, index) => (
                    <div key={index} className="grid gap-3 md:grid-cols-3">
                      <label htmlFor={`ticket-type-${index}`} className="sr-only">Ticket type</label>
                      <input
                        id={`ticket-type-${index}`}
                        type="text"
                        placeholder="Type"
                        value={ticket.type}
                        onChange={(e) => handleTicketChange(index, 'type', e.target.value)}
                        className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-orange-200 focus:outline-none"
                        required
                      />
                      <label htmlFor={`ticket-price-${index}`} className="sr-only">Ticket price</label>
                      <input
                        id={`ticket-price-${index}`}
                        type="text"
                        placeholder="Price"
                        value={ticket.price}
                        onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                        className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-orange-200 focus:outline-none"
                        required
                      />
                      <label htmlFor={`ticket-quantity-${index}`} className="sr-only">Ticket quantity</label>
                      <input
                        id={`ticket-quantity-${index}`}
                        type="number"
                        placeholder="Quantity"
                        value={ticket.quantity}
                        onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                        className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-orange-200 focus:outline-none"
                        required
                      />
                      <button type="button" onClick={() => removeTicket(index)} className="text-left text-xs text-red-300">
                        Remove ticket
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addTicket}
                  className="mt-4 rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white"
                >
                  Add another ticket
                </button>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePreviousSection}
                    className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
                        {editEventId ? 'Updating...' : 'Publishing...'}
                      </span>
                    ) : (
                      editEventId ? 'Update event' : 'Publish event'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Date Picker Modal */}
          {showDateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setShowDateModal(false)}>
              <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/90 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Select Date</h3>
                  <button
                    onClick={() => setShowDateModal(false)}
                    className="rounded-full p-2 transition hover:bg-white/10"
                  >
                    <HiXMark className="h-5 w-5" />
                  </button>
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => handleDateSelect(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-orange-200 focus:outline-none"
                  autoFocus
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setShowDateModal(false)}
                    className="rounded-2xl border border-white/20 px-6 py-2 text-sm font-semibold text-white transition hover:border-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Time Picker Modal */}
          {showTimeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setShowTimeModal(false)}>
              <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/90 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Select {selectedTimeField === 'start' ? 'Start' : 'End'} Time</h3>
                  <button
                    onClick={() => setShowTimeModal(false)}
                    className="rounded-full p-2 transition hover:bg-white/10"
                  >
                    <HiXMark className="h-5 w-5" />
                  </button>
                </div>
                <div className="max-h-96 space-y-2 overflow-y-auto">
                  {timeOptions.map((time) => {
                    const isSelected = selectedTimeField === 'start' ? time === startTime : time === endTime;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleTimeSelect(time)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                          isSelected
                            ? 'border-orange-200 bg-orange-200/20 text-orange-200'
                            : 'border-white/10 bg-black/40 text-white hover:border-white/20'
                        }`}
                      >
                        {formatTime(time)}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setShowTimeModal(false)}
                    className="rounded-2xl border border-white/20 px-6 py-2 text-sm font-semibold text-white transition hover:border-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Location Picker Modal */}
          {showLocationModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setShowLocationModal(false)}>
              <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/90 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Select Location</h3>
                  <button
                    onClick={() => setShowLocationModal(false)}
                    className="rounded-full p-2 transition hover:bg-white/10"
                  >
                    <HiXMark className="h-5 w-5" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Search for a city..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="mb-4 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-orange-200 focus:outline-none"
                  autoFocus
                />
                <div className="max-h-96 space-y-2 overflow-y-auto">
                  {filteredCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleLocationSelect(city)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                        location === city
                          ? 'border-orange-200 bg-orange-200/20 text-orange-200'
                          : 'border-white/10 bg-black/40 text-white hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <HiMapPin className="h-4 w-4" />
                        {city}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setShowLocationModal(false)}
                    className="rounded-2xl border border-white/20 px-6 py-2 text-sm font-semibold text-white transition hover:border-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
      <Mobilenav />
    </main>
  );
};

export default EventCreationForm;
