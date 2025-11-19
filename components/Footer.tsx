import Link from "next/link";
import {
  FaXTwitter,
  FaLinkedin,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa6";

const footerLinks = {
  Product: [
    { label: "Events", href: "/events" },
    { label: "Organizer dashboard", href: "/dashboard/organizer" },
    { label: "Help Center", href: "/help" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Partners", href: "/partners" },
  ],
  Resources: [
    { label: "Guides", href: "/resources/guides" },
    { label: "Case studies", href: "/resources/case-studies" },
    { label: "Status", href: "/status" },
  ],
  Policies: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Security", href: "/security" },
    { label: "Cookie Policy", href: "/policies/cookie" },
    { label: "Refund Policy", href: "/policies/refund" },
  ],
};

const socialLinks = [
  { icon: FaXTwitter, label: "Eventie on X", href: "https://twitter.com" },
  { icon: FaLinkedin, label: "Eventie on LinkedIn", href: "https://linkedin.com" },
  { icon: FaInstagram, label: "Eventie on Instagram", href: "https://instagram.com" },
  { icon: FaFacebook, label: "Eventie on Facebook", href: "https://facebook.com" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full border-t border-white/5 bg-[#030303] text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_repeat(3,1fr)]">
          <div className="space-y-6">
            <div>
              <p className="text-2xl font-semibold text-white">Eventie</p>
              <p className="mt-3 text-sm text-gray-400">
                Run production-ready experiences across Africa with ticketing,
                automation, and financial tooling in one platform.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-orange-500/25 via-rose-500/15 to-purple-600/25 p-6 text-white shadow-lg shadow-orange-500/10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_55%)]" />
              <div className="relative z-10 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-orange-200">
                    Stay in the loop
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">
                    Roadmaps, drop alerts, and playbooks in your inbox.
                  </h3>
                </div>

                <form
                  className="flex flex-col gap-3 sm:flex-row"
                  action="/api/newsletter"
                  method="post"
                >
                  <label htmlFor="newsletter" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter"
                    name="email"
                    type="email"
                    required
                    placeholder="team@studio.com"
                    className="w-full rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/70 focus:border-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
                  >
                    Join waitlist
                  </button>
                </form>
                <p className="text-xs text-white/70">
                  Zero spam. Quarterly roundups with product drops and case studies.
                </p>
              </div>
            </div>

            <div className="flex gap-4 text-white">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  className="rounded-full border border-white/15 p-2 transition hover:border-white"
                >
                  <link.icon />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-gray-400">
                {title}
              </p>
              <ul className="mt-4 space-y-3 text-sm text-gray-400">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link className="transition hover:text-white" href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-gray-500">
          <p>© {currentYear} Eventie Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>
            <Link href="/security" className="transition hover:text-white">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
