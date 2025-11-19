import Link from "next/link";

const NewsletterSuccessPage = () => (
  <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
    <div className="max-w-md rounded-3xl border border-white/10 bg-black/70 p-8 text-center">
      <p className="text-sm uppercase tracking-[0.4em] text-orange-200">Success</p>
      <h1 className="mt-4 text-3xl font-semibold">You’re on the list.</h1>
      <p className="mt-3 text-sm text-gray-300">
        Expect quarterly drop alerts, playbooks, and behind-the-scenes notes from the
        Eventie team.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-2 text-sm font-semibold text-white transition hover:border-white"
      >
        Back to homepage
      </Link>
    </div>
  </main>
);

export default NewsletterSuccessPage;


