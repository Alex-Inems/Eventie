'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { auth, googleProvider, db } from '../../firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { motion } from 'framer-motion';

const slideImages = [
  '/images/slide.jpg',
  '/images/slide(2).jpg',
  '/images/slide(3).jpg',
];

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

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

        await setDoc(doc(db, 'users', user.uid), {
          username,
          email,
        });

        router.push('/dashboard/organizer');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/dashboard/organizer');
      }
    } catch (error) {
      console.error('Authentication Error', error);
      alert('Error: ' + (error as Error).message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/dashboard/organizer');
    } catch (error) {
      console.error('Google login error', error);
    }
  };

  return (
    <div className="relative w-full h-screen flex justify-center items-center overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 w-full h-full">
        {slideImages.map((image, index) => (
          <motion.img
            key={index}
            src={image}
            alt="Background"
            className="absolute w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentIndex ? 1 : 0 }}
            transition={{ duration: 1 }}
          />
        ))}
      </div>

      {/* Dark Overlay for contrast */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Transparent Login Box (Glassmorphism) */}
      <motion.div
        className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-semibold text-center text-white mb-6">
          {isRegistering ? 'Create Account' : 'Welcome Back!'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-white/30 rounded-lg bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-white/30 rounded-lg bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-white/30 rounded-lg bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition">
            {isRegistering ? 'Register' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="w-full p-3 mt-4 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
        >
          Sign in with Google
        </button>

        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="mt-4 text-blue-300 hover:underline w-full text-center"
        >
          {isRegistering ? 'Already have an account? Sign In' : 'Don’t have an account? Register'}
        </button>
      </motion.div>
    </div>
  );
};

export default Auth;
