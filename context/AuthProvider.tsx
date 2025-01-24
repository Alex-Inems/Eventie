// context/AuthProvider.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth'; // Import Firebase's user-related types
import { auth } from '../firebaseConfig'; // Adjust the path if needed
import AuthContext from './AuthContext'; // Import the AuthContext

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Loading state to avoid flickers

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user); // Log user info
      setCurrentUser(user); // Set user directly, as it will be null if not authenticated
      setLoading(false); // Stop loading once auth state is confirmed
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Render a loader until Firebase confirms auth state
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
