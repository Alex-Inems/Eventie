"use client";

import { createContext, useContext } from "react";
import { User } from "firebase/auth";

// Define the context interface
interface AuthContextProps {
  currentUser: User | null;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Custom hook for consuming auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
