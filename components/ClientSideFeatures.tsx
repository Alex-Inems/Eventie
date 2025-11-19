"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiArrowUpRight,
  HiMiniMagnifyingGlass,
  HiBars3,
} from "react-icons/hi2";
import AuthContext from "@/context/AuthContext";
import AnimatedGrid from "./AnimatedGridBackground";

const stats = [
  { value: "1,200+", label: "active organizers" },
  { value: "180K", label: "tickets issued" },
  { value: "40+", label: "cities supported" },
  { value: "99.95%", label: "checkout uptime" },
];

const quickFilters = [
  "Live shows",
  "Tech meetups",
  "Food & drink",
  "Creator labs",
];

const highlights = [
  "Unified ticketing across mobile & web",
  "Built-in CRM for segments and updates",
  "Realtime payouts with fraud screening",
];

const navLinks = [
  { label: "Events", href: "/events" },
  { label: "Organizers", href: "/dashboard/organizer" },
  { label: "Help Center", href: "/help" },
];

const ClientSideFeatures = () => {
  const authContext = useContext(AuthContext);
  const currentUser = authContext?.currentUser ?? null;
  const logout = authContext?.logout;
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleSearch = (term?: string) => {
    const query = term ?? searchQuery;
    if (!query.trim()) return;

    router.push(`/events?search=${encodeURIComponent(query.trim())}`);
    if (!term) return;
    setSearchQuery(term);
  };

  const handleLogout = async () => {
    if (!logout) return;
    try {
      setIsLoggingOut(true);
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="relative overflow-hidden bg-[#020202]">
      <AnimatedGrid />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col px-4 py-10 sm:px-6 lg:px-8 lg:py-20">
        <nav className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-white/10 bg-black/40 px-5 py-3 backdrop-blur">
          <Link
            href="/"
            className="flex items-center gap-3 text-base font-semibold tracking-tight"
          >
            <Image
              src="/images/4.png"
              alt="Eventie logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full border border-white/10 object-cover"
              priority
            />
            Eventie
          </Link>

          <div className="hidden items-center gap-6 text-sm text-gray-300 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <Link
                  href="/dashboard/organizer"
                  className="hidden rounded-full border border-white/40 px-4 py-1.5 text-sm font-semibold text-white/90 transition hover:border-white md:inline-flex"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-200 disabled:opacity-70"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Signing out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="rounded-full border border-white/40 px-4 py-1.5 text-sm font-semibold text-white/80 transition hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/auth?mode=signup"
                  className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
                >
                  Create account
                </Link>
              </>
            )}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded-full border border-white/30 p-2 text-white md:hidden"
              aria-label="Toggle navigation menu"
            >
              <HiBars3 className="h-5 w-5" />
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/70 p-4 text-sm text-gray-200 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-white/5 px-4 py-2"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {currentUser ? (
              <>
                <Link
                  href="/dashboard/organizer"
                  className="rounded-xl border border-white/5 px-4 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  className="rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Signing out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="rounded-xl border border-white/5 px-4 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/auth?mode=signup"
                  className="rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900"
                  onClick={() => setMenuOpen(false)}
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        )}

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-orange-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              Live in 8 cities
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Discover events, align teams, and ship unforgettable experiences.
            </h1>
            <p className="mt-5 text-lg text-gray-300">
              Eventie keeps attendee acquisition, production workflows, and
              realtime communication in one collaborative workspace.
            </p>

            <form
              className="mt-8"
              onSubmit={(event) => {
                event.preventDefault();
                handleSearch();
              }}
            >
              <div className="relative">
                <HiMiniMagnifyingGlass className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search for concerts, meetups, communities..."
                  className="w-full rounded-full border border-white/10 bg-white/10 py-4 pl-14 pr-40 text-base text-white placeholder:text-gray-400 focus:border-orange-200 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-200">
              {quickFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => handleSearch(filter)}
                  className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/60 hover:text-white"
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-white/5 bg-white/5 p-6">
            <div className="overflow-hidden rounded-2xl border border-white/5 bg-black/40">
              <Image
                src="/images/slide.jpg"
                alt="Featured event hero"
                width={640}
                height={480}
                className="h-64 w-full object-cover"
                priority
              />
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <div>
                    <p className="font-semibold text-white">Creator Lab 004</p>
                    <p>Saturday · 5PM · Nairobi</p>
                  </div>
                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300">
                    Live
                  </span>
                </div>
                <p className="text-base text-gray-300">
                  Community builders, brand partners, and headline speakers align
                  on programming, stage design, and comms in one doc.
                </p>
                <ul className="space-y-3 text-sm text-gray-300">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/events"
                  className="flex items-center gap-2 text-sm font-semibold text-white transition hover:text-orange-200"
                >
                  Preview the full schedule
                  <HiArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </header>
  );
};

export default ClientSideFeatures;
