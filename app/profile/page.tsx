'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import Sidebar from '@/components/Sidebar';
import Mobilenav from '@/components/Mobilenav';
import SmartImage from '@/components/SmartImage';

const DEFAULT_PROFILE_PIC = '/images/default-profile.jpeg'; // Path to default profile image
const DEFAULT_COVER_PIC = '/images/slide4.jpg'; // Path to default cover image

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


  // Centered milky spinner while loading
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#040404] text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#040404] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.1),_transparent_60%)]" />
      <div className="relative z-10 flex flex-col lg:flex-row">
        <Sidebar />
        <section className="flex-1 px-4 py-12 lg:ml-[320px] lg:px-12">
          {toastMessage && (
            <div
              className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${toastType === 'success' ? 'border-green-500 bg-green-500/10 text-green-200' : 'border-red-500 bg-red-500/10 text-red-200'
                }`}
            >
              {toastMessage}
            </div>
          )}

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/70">
            <div className="relative h-56 w-full">
              <SmartImage src={coverPic} alt="Cover" fill className="object-cover" fallbackSrc={DEFAULT_COVER_PIC} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>
            <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24">
                  <SmartImage
                    src={profilePic}
                    alt="Profile"
                    fill
                    className="rounded-3xl border-4 border-black object-cover"
                    fallbackSrc={DEFAULT_PROFILE_PIC}
                  />
                  {isVerified && (
                    <CheckCircleIcon className="absolute -bottom-1 -right-1 h-6 w-6 text-green-400" />
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Organizer</p>
                  <h1 className="mt-1 text-2xl font-semibold">{userName}</h1>
                  <p className="text-sm text-gray-400">{email}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <label className="cursor-pointer rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white">
                  Update cover
                  <input type="file" accept="image/*" onChange={handleCoverPicChange} className="hidden" />
                </label>
                {coverPic !== DEFAULT_COVER_PIC && (
                  <button
                    onClick={removeCoverPic}
                    disabled={removingPic}
                    className="rounded-full border border-red-400/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-400 disabled:opacity-70"
                  >
                    {removingPic ? 'Removing...' : 'Remove cover'}
                  </button>
                )}
                <label className="cursor-pointer rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white">
                  Update avatar
                  <input type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" />
                </label>
                {profilePic !== DEFAULT_PROFILE_PIC && (
                  <button
                    onClick={removeProfilePic}
                    disabled={removingPic}
                    className="rounded-full border border-red-400/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-400 disabled:opacity-70"
                  >
                    {removingPic ? 'Removing...' : 'Remove avatar'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-black/70 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Identity</p>
              <div className="mt-6 space-y-5">
                <div>
                  <label htmlFor="profile-name" className="text-xs uppercase tracking-[0.3em] text-gray-400">Name</label>
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-orange-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="profile-location" className="text-xs uppercase tracking-[0.3em] text-gray-400">Location</label>
                  <input
                    id="profile-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-orange-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="profile-bio" className="text-xs uppercase tracking-[0.3em] text-gray-400">Bio</label>
                  <textarea
                    id="profile-bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                    rows={4}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-orange-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/70 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Presence</p>
              <div className="mt-6 space-y-5">
                <div>
                  <label htmlFor="profile-twitter" className="text-xs uppercase tracking-[0.3em] text-gray-400">Twitter</label>
                  <input
                    id="profile-twitter"
                    type="url"
                    value={socialLinks.twitter}
                    onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                    required
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-orange-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="profile-linkedin" className="text-xs uppercase tracking-[0.3em] text-gray-400">LinkedIn</label>
                  <input
                    id="profile-linkedin"
                    type="url"
                    value={socialLinks.linkedin}
                    onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                    required
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-orange-200 focus:outline-none"
                  />
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-gray-400">
                  Completing every field unlocks a verified badge and priority placement across the
                  Eventie network.
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleProfileUpdate}
            disabled={saving}
            className="mt-10 w-full rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-200 disabled:opacity-60"
          >
            {saving ? 'Saving profile...' : 'Save profile'}
          </button>
        </section>
      </div>
      <Mobilenav />
    </main>
  );
};

export default ProfilePage;
