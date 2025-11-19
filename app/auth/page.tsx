"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../../firebaseConfig";
import { toast } from 'react-toastify';

const slideImages = ["/images/slide.jpg", "/images/slide(2).jpg", "/images/slide(3).jpg"];

const proofPoints = [
  "Trusted by 1,200+ organizers across Africa",
  "Instant payouts with fraud protection",
  "Collaborative dashboards for every team",
];

type Mode = "signin" | "signup";

const Auth = () => {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      if (mode === "signup") {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          username,
          email,
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/dashboard/organizer");
    } catch (error) {
      console.error("Authentication Error", error);
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('email-already-in-use')) {
        toast.error('This email is already registered. Please sign in instead.');
      } else if (errorMessage.includes('weak-password')) {
        toast.error('Password should be at least 6 characters.');
      } else if (errorMessage.includes('invalid-email')) {
        toast.error('Please enter a valid email address.');
      } else if (errorMessage.includes('wrong-password') || errorMessage.includes('user-not-found')) {
        toast.error('Invalid email or password. Please try again.');
      } else {
        toast.error('Authentication failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard/organizer");
    } catch (error) {
      console.error("Google login error", error);
      toast.error("Unable to complete Google sign-in. Please try again.");
    }
  };

  const isSignup = mode === "signup";

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        {slideImages.map((image, index) => (
          <motion.img
            key={image}
            src={image}
            alt="Eventie backdrop"
            className="absolute h-full w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentIndex ? 0.35 : 0 }}
            transition={{ duration: 1 }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black via-black/90 to-black/70" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:gap-20">
        <div className="flex-1 space-y-6">
          <p className="text-sm uppercase tracking-[0.4em] text-orange-200">
            Eventie access
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Ship unforgettable experiences with secure, collaborative tools.
          </h1>
          <p className="text-base text-gray-300">
            One login unlocks ticketing, payouts, permissions, and audience insights for
            your entire team.
          </p>
          <ul className="space-y-3 text-sm text-gray-300">
            {proofPoints.map((point) => (
              <li key={point} className="flex items-center gap-3">
                <span className="h-1.5 w-6 rounded-full bg-orange-300" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <motion.div
          className="flex-1 rounded-3xl border border-white/10 bg-black/70 p-6 shadow-2xl backdrop-blur md:p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/50 p-1">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${!isSignup ? "bg-white text-gray-900" : "text-gray-400"
                }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${isSignup ? "bg-white text-gray-900" : "text-gray-400"
                }`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {isSignup && (
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.35em] text-gray-400">
                  Workspace / crew name
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                  placeholder="Creator Lab"
                  className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-orange-200 focus:outline-none"
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-[0.35em] text-gray-400">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="team@eventie.app"
                className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-orange-200 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-[0.35em] text-gray-400">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-orange-200 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-200 disabled:opacity-70"
            >
              {isSubmitting
                ? "Processing..."
                : isSignup
                  ? "Create free account"
                  : "Sign in to Eventie"}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full rounded-2xl border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-white"
            >
              Continue with Google
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-400">
            By continuing you agree to Eventie’s{" "}
            <Link href="/terms" className="text-orange-200 underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-orange-200 underline">
              Privacy Policy
            </Link>
            .
          </p>
        </motion.div>
      </section>
    </main>
  );
};

export default Auth;
