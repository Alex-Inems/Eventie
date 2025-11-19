import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Eventie",
  description:
    "Understand how Eventie uses cookies and local storage to keep your experience secure and personalized.",
};

const categories = [
  {
    title: "Essential cookies",
    copy: "Required for authentication, session continuity, and fraud prevention. These cannot be disabled because the product would stop working.",
  },
  {
    title: "Performance",
    copy: "Anonymous analytics that help us diagnose errors and measure feature usage so we can prioritize improvements.",
  },
  {
    title: "Experience",
    copy: "Saves organizer preferences (like dashboard filters) and attendee selections (like preferred cities) on your device.",
  },
];

const CookiePolicyPage = () => (
  <main className="min-h-screen bg-black text-white">
    <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.4em] text-orange-200">
        Cookie policy
      </p>
      <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">
        Transparent storage practices across apps and marketing surfaces.
      </h1>
      <p className="mt-4 text-lg text-gray-300">
        We only store what’s required to give you a secure, personalized experience.
        You can clear cookies anytime from your browser and we’ll regenerate fresh ones
        the next time you log in.
      </p>
    </section>

    <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {categories.map((category) => (
          <article
            key={category.title}
            className="rounded-3xl border border-white/10 bg-black/70 p-6"
          >
            <h2 className="text-2xl font-semibold">{category.title}</h2>
            <p className="mt-3 text-sm text-gray-300">{category.copy}</p>
          </article>
        ))}
      </div>
      <p className="mt-8 text-xs text-gray-400">
        Questions? Contact privacy@eventie.app.
      </p>
    </section>
  </main>
);

export default CookiePolicyPage;


