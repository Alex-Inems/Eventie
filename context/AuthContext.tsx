// context/AuthContext.tsx
'use client';

import { createContext, useContext } from 'react';
import { User } from 'firebase/auth'; // Import Firebase's user-related types

// Define the context interface
interface AuthContextProps {
  currentUser: User | null;
}

// Create the context with default value
const AuthContext = createContext<AuthContextProps | undefined>(undefined); // Initialize with undefined

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
