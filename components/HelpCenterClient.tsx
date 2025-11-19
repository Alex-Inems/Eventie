"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { MdMail, MdChatBubbleOutline } from "react-icons/md";

const faqs = [
  {
    question: "How can I reset my password?",
    answer:
      'Select "Forgot password" on the sign-in page, enter your account email, and follow the link we send you.',
  },
  {
    question: "How do I invite teammates?",
    answer:
      "Head to Profile → Team, add their emails, and assign the correct permission set before sending invites.",
  },
  {
    question: "Where can I see payouts?",
    answer:
      "Inside the organizer dashboard, open Finance → Payouts for a breakdown of cleared and pending transfers.",
  },
];

const resourceCards = [
  {
    title: "Organizer onboarding",
    description: "Set up roles, import templates, and run your first event in under an hour.",
    link: "/resources/guides",
  },
  {
    title: "Event quality checklist",
    description: "A step-by-step QA process for venues, crews, and comms before doors open.",
    link: "/resources/case-studies",
  },
];

const contactChannels = [
  {
    icon: MdMail,
    title: "Email support",
    detail: "support@eventie.app",
    description: "Response within 1 business day for roadmap, billing, or compliance requests.",
  },
  {
    icon: MdChatBubbleOutline,
    title: "Live chat",
    detail: "Weekdays · 9am – 7pm WAT",
    description: "Open chat from the dashboard footer for urgent launch questions.",
  },
];

const HelpCenterClient = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/auth");
    }
  }, [auth.currentUser, router]);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="flex-1 px-4 py-12 lg:ml-[320px] lg:px-12">
      <div className="max-w-4xl">
        <p className="text-sm uppercase tracking-[0.35em] text-orange-200">Need support</p>
        <h1 className="mt-4 text-4xl font-semibold">Help Center</h1>
        <p className="mt-3 text-sm text-gray-300">
          Search best practices, review FAQs, or connect with a real human when you are in production
          mode.
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-black/60 p-6">
        <label className="text-xs uppercase tracking-[0.4em] text-gray-400">Search the docs</label>
        <div className="mt-3">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Permissions, payouts, templates..."
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-orange-200 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {resourceCards.map((resource) => (
          <article key={resource.title} className="rounded-3xl border border-white/10 bg-black/60 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Playbook</p>
            <h2 className="mt-3 text-xl font-semibold">{resource.title}</h2>
            <p className="mt-2 text-sm text-gray-300">{resource.description}</p>
            <button
              className="mt-4 text-sm font-semibold text-white underline"
              onClick={() => router.push(resource.link)}
            >
              View guide →
            </button>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-white/10 bg-black/70 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Frequently asked</h2>
          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
            {filteredFaqs.length} topics
          </p>
        </div>
        <div className="mt-4 divide-y divide-white/10">
          {filteredFaqs.map((faq, index) => (
            <button
              key={faq.question}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full py-4 text-left"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-white">{faq.question}</p>
                <span className="text-lg text-gray-500">{openIndex === index ? "–" : "+"}</span>
              </div>
              {openIndex === index && <p className="mt-2 text-sm text-gray-400">{faq.answer}</p>}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {contactChannels.map((channel) => (
          <article
            key={channel.title}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-black/70 to-black/80 p-5"
          >
            <channel.icon className="text-2xl text-orange-200" />
            <h3 className="mt-3 text-lg font-semibold">{channel.title}</h3>
            <p className="text-sm text-gray-300">{channel.description}</p>
            <p className="mt-3 text-base text-white">{channel.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HelpCenterClient;
