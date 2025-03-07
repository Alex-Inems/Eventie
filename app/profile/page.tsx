'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import Sidebar from '@/components/Sidebar';
import Mobilenav from '@/components/Mobilenav';
import Image from 'next/image';

const DEFAULT_PROFILE_PIC = '/default-profile.png'; // Path to default profile image
const DEFAULT_COVER_PIC = '/default-cover.jpg'; // Path to default cover image

// Define interface for UserUpdates
interface UserUpdates {
  name: string;
  bio: string;
  location: string;
  socialLinks: { twitter: string; linkedin: string };
  profilePic?: string;
  coverPic?: string;
  isVerified?: boolean;
}

const ProfilePage = () => {
  const auth = getAuth();
  const router = useRouter();
  const user = auth.currentUser;

  // State declarations
  const [userName, setUserName] = useState(''); 
  const [name, setName] = useState<string>(''); 
  const [email, setEmail] = useState<string>(''); 
  const [profilePic, setProfilePic] = useState<string>(''); 
  const [coverPic, setCoverPic] = useState<string>(''); 
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null); 
  const [newCoverPic, setNewCoverPic] = useState<File | null>(null); 
  const [bio, setBio] = useState<string>(''); 
  const [location, setLocation] = useState<string>(''); 
  const [socialLinks, setSocialLinks] = useState<{ twitter: string; linkedin: string }>({ twitter: '', linkedin: '' });

  const [loading, setLoading] = useState<boolean>(true); 
  const [saving, setSaving] = useState<boolean>(false); 
  const [removingPic, setRemovingPic] = useState<boolean>(false); 
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const logout = () => {
    const auth = getAuth();
    auth.signOut().then(() => {
      router.push('/auth');
    });
  };

  // Fetch user data and update state
  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    setUserName(user.displayName || 'Organizer');
    setEmail(user.email || '');
    setProfilePic(user.photoURL || DEFAULT_PROFILE_PIC);
    setCoverPic(DEFAULT_COVER_PIC);

    const fetchUserData = async () => {
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.name) setName(userData.name);
        if (userData.profilePic) setProfilePic(userData.profilePic);
        if (userData.coverPic) setCoverPic(userData.coverPic);
        if (userData.bio) setBio(userData.bio);
        if (userData.location) setLocation(userData.location);
        if (userData.socialLinks) setSocialLinks(userData.socialLinks);
        if (userData.isVerified !== undefined) setIsVerified(userData.isVerified);
      }
      setLoading(false);
    };

    fetchUserData();

  }, [user, router]);

  // Update profile handler
  const handleProfileUpdate = async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (!name || !bio || !location || !profilePic || !socialLinks.twitter || !socialLinks.linkedin) {
        setToastMessage('Please fill out all fields before updating your profile!');
        setToastType('error');
        setSaving(false);
        return;
      }

      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      const updates: UserUpdates = { name, bio, location, socialLinks };

      if (newProfilePic) {
        const storage = getStorage();
        const storageReference = storageRef(storage, `profile_pics/${user.uid}`);
        await uploadBytes(storageReference, newProfilePic);
        const downloadURL = await getDownloadURL(storageReference);
        updates.profilePic = downloadURL;
        await updateProfile(user, { photoURL: downloadURL });
        setProfilePic(downloadURL);
      }

      if (newCoverPic) {
        const storage = getStorage();
        const storageReference = storageRef(storage, `cover_pics/${user.uid}`);
        await uploadBytes(storageReference, newCoverPic);
        const downloadURL = await getDownloadURL(storageReference);
        updates.coverPic = downloadURL;
        setCoverPic(downloadURL);
      }

      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }

      const isSocialLinksValid = validateSocialLinks(socialLinks);
      if (isSocialLinksValid && name && bio && location && profilePic !== DEFAULT_PROFILE_PIC) {
        updates.isVerified = true;
        setIsVerified(true);
      } else {
        updates.isVerified = false;
        setIsVerified(false);
      }

      await set(userRef, updates);
      setToastMessage('Profile updated successfully!');
      setToastType('success');
      router.push('/dashboard/organizer');
    } catch (error) {
      console.error('Error updating profile:', error);
      setToastMessage('Failed to update profile.');
      setToastType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfilePic(e.target.files[0]);
    }
  };

  const handleCoverPicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewCoverPic(e.target.files[0]);
    }
  };

  const removeProfilePic = async () => {
    if (!user) return;
    setRemovingPic(true);
    try {
      const storage = getStorage();
      const storageReference = storageRef(storage, `profile_pics/${user.uid}`);
      await deleteObject(storageReference);
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      await updateProfile(user, { photoURL: DEFAULT_PROFILE_PIC });
      await set(userRef, { profilePic: DEFAULT_PROFILE_PIC });
      setProfilePic(DEFAULT_PROFILE_PIC);
      setToastMessage('Profile picture removed successfully!');
      setToastType('success');
    } catch (error) {
      console.error('Error removing profile picture:', error);
      setToastMessage('Failed to remove profile picture.');
      setToastType('error');
    } finally {
      setRemovingPic(false);
    }
  };

  const removeCoverPic = async () => {
    if (!user) return;
    setRemovingPic(true);
    try {
      const storage = getStorage();
      const storageReference = storageRef(storage, `cover_pics/${user.uid}`);
      await deleteObject(storageReference);
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      await set(userRef, { coverPic: DEFAULT_COVER_PIC });
      setCoverPic(DEFAULT_COVER_PIC);
      setToastMessage('Cover picture removed successfully!');
      setToastType('success');
    } catch (error) {
      console.error('Error removing cover picture:', error);
      setToastMessage('Failed to remove cover picture.');
      setToastType('error');
    } finally {
      setRemovingPic(false);
    }
  };

  const validateSocialLinks = (links: { twitter: string; linkedin: string }): boolean => {
    const twitterPattern = /^(https?:\/\/)?(www\.)?(x\.com\/)([A-Za-z0-9_]+)/;
    const linkedinPattern = /^(https?:\/\/)?(www\.)?(linkedin\.com\/)(in\/[A-Za-z0-9_-]+)/;
    return twitterPattern.test(links.twitter) && linkedinPattern.test(links.linkedin);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar
        userName={userName}
        userProfilePic={profilePic}
        logout={() => {
          const auth = getAuth();
          auth.signOut().then(() => {
            router.push('/auth');
          });
        }}
      />
      {/* Main Content */}
      <div className="flex-1 p-6 lg:ml-44 max-w-screen-lg mx-auto mb-14">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Profile</h1>

          {/* Toast message */}
          {toastMessage && (
          <div
            className={`p-4 mb-4 rounded-md fixed top-0 left-0 w-full z-50 ${toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
          >
            {toastMessage}
          </div>
        )}

        {/* Cover Image */}
        <div className="mb-8 relative">
          <Image
            src={coverPic}
            alt="Cover"
            className="w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover rounded-lg shadow-lg mb-4"
            width={1600} // specify width
            height={500} // specify height
          />

          {/* Input and Button Below */}
          <div className="mt-4 flex justify-between items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverPicChange}
              className="bg-white p-2 rounded-md shadow-md cursor-pointer w-full sm:w-auto"
            />
            {coverPic !== DEFAULT_COVER_PIC && (
              <button
                onClick={removeCoverPic}
                disabled={removingPic}
                className="ml-4 bg-red-600 text-white px-4 py-2 rounded-md text-xs shadow-md hover:bg-red-700 transition"
              >
                {removingPic ? 'Removing...' : 'Remove Cover'}
              </button>
            )}
          </div>
        </div>

        {/* Profile Picture */}
<div className="flex items-center space-x-6 mb-8">
  <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40">
    <Image
      src={profilePic}
      alt="Profile"
      className="w-full h-full rounded-full object-cover shadow-lg border-4 border-white"
      width={96} // specify width
      height={96} // specify height
    />
  </div>

  {isVerified && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
  
  <div className="flex flex-col">
    <h2 className="text-xl font-semibold">{userName}</h2>
    <div className="text-sm text-gray-500">{email}</div>

    <div className="flex flex-col sm:flex-row sm:space-x-4 mt-4">
      <button
        onClick={removeProfilePic}
        disabled={removingPic}
        className="bg-red-600 text-white px-4 py-2 rounded-md text-xs shadow-md hover:bg-red-700 transition w-full sm:w-auto"
      >
        {removingPic ? 'Removing...' : 'Remove Profile'}
      </button>

      {/* Add Profile Picture */}
      {profilePic === DEFAULT_PROFILE_PIC && (
        <div className="mt-4 sm:mt-0">
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="bg-white p-2 rounded-md shadow-md cursor-pointer w-full sm:w-auto"
          />
        </div>
      )}
    </div>
  </div>
</div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-2 p-3 border border-gray-300 rounded-md shadow-md"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              className="w-full mt-2 p-3 border border-gray-300 rounded-md shadow-md"
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full mt-2 p-3 border border-gray-300 rounded-md shadow-md"
            />
          </div>

          {/* Social Links */}
          <div>
            <label className="text-sm text-gray-600">Twitter</label>
            <input
              type="url"
              value={socialLinks.twitter}
              onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
              required
              className="w-full mt-2 p-3 border border-gray-300 rounded-md shadow-md"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">LinkedIn</label>
            <input
              type="url"
              value={socialLinks.linkedin}
              onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
              required
              className="w-full mt-2 p-3 border border-gray-300 rounded-md shadow-md"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleProfileUpdate}
            disabled={saving}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md shadow-md mt-6 hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
        
      </div>
       {/* Mobile Navigation */}
       <Mobilenav router={router} logout={logout} />      
    </div>
  );
};

export default ProfilePage;
