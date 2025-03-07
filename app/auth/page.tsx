'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import { auth, googleProvider, db } from '../../firebaseConfig';
import { setDoc, doc } from "firebase/firestore";

import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { motion } from 'framer-motion';

const slideImages = [
  '/images/stock.jpg',
  '/images/cloud.jpg',
  '/images/payment.jpg',
];

const Auth = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>(''); // State for username
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter(); // Initialize router for redirection

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slideImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store the username in Firestore under the user's UID
        await setDoc(doc(db, 'users', user.uid), {
          username: username,
          email: email,
        });

        alert('Registration successful');
        router.push('/dashboard/organizer'); // Redirect to homepage after registration
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Login successful');
        router.push('/dashboard/organizer'); // Redirect to homepage after login
      }
    } catch (error) {
      console.error('Authentication Error', error);
      alert('Error: ' + (error as Error).message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert('Google login successful');
      router.push('/'); // Redirect to homepage after Google login
    } catch (error) {
      console.error('Google login error', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <motion.div className="w-full p-12 md:w-1/2 flex flex-col justify-center items-center bg-white shadow-xl rounded-lg">
        <h1 className="text-3xl font-serif mb-6">{isRegistering ? 'Create Account' : 'Welcome Back!'}</h1>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {isRegistering && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition">
            {isRegistering ? 'Register' : 'Sign In'}
          </button>
        </form>

        <button onClick={handleGoogleLogin} className="w-full p-3 mt-4 bg-red-600 text-white rounded-lg hover:bg-red-500 transition">
          Sign in with Google
        </button>

        <button onClick={() => setIsRegistering(!isRegistering)} className="mt-4 text-blue-600 hover:underline">
          {isRegistering ? 'Already have an account? Sign In' : 'Don’t have an account? Register'}
        </button>
      </motion.div>

      <motion.div className="hidden md:flex md:w-1/2 relative">
        <motion.img
          src={slideImages[currentIndex]}
          alt="Slide"
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </motion.div>
    </div>
  );
};

export default Auth;
