"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import Next.js router
import { onAuthStateChanged, User, signOut, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "../firebaseConfig";
import AuthContext from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize Next.js router

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          console.log("Auth state changed:", user);
          setCurrentUser(user);
          setLoading(false);
        });

        return () => unsubscribe();
      })
      .catch((error) => {
        console.error("Error setting auth persistence:", error);
      });
  }, []);

  // Logout function with redirect
  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/auth"); // Redirect to auth page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
