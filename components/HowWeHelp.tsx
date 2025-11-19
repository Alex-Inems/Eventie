"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedGrid from "./AnimatedGridBackground";

interface StepData {
  number: number;
  title: string;
  points: string[];
  buttonText: string;
  ctaHref: string;
}

const steps: StepData[] = [
  {
    number: 1,
    title: "Discover events instantly",
    points: [
      "Curated lists by genre, price, and city with saved searches.",
      "Smart recommendations that learn from your activity.",
      "Calendar exports and crew reminders keep everyone in sync.",
    ],
    buttonText: "Start exploring",
    ctaHref: "/events",
  },
  {
    number: 2,
    title: "Register or host with ease",
    points: [
      "Spin up branded landing pages with schedule blocks and FAQs.",
      "Automate RSVPs, table management, and onsite check-in.",
      "Sync payouts with finance tools via connected workflows.",
    ],
    buttonText: "Launch an event",
    ctaHref: "/dashboard/organizer",
  },
  {
    number: 3,
    title: "Engage and grow",
    points: [
      "Segmented updates and push reminders keep seats filled.",
      "Collect NPS, qualitative feedback, and sponsor-ready recaps.",
      "Convert attendees into members with loyalty journeys.",
    ],
    buttonText: "Activate audience",
    ctaHref: "/help",
  },
];

const metrics = [
  { value: "6 mins", label: "avg time to publish" },
  { value: "3x", label: "faster attendee comms" },
  { value: "92%", label: "repeat organizers" },
];

const signals = [
  {
    title: "Risk-free launch",
    description:
      "Compliance docs, payouts, and ops logs live with the event so audits take minutes.",
  },
  {
    title: "Connected stakeholders",
    description:
      "Vendors, security, and sponsors access the same source of truth with role-based controls.",
  },
];

const HowWeHelp: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const elements = cardRefs.current.filter(
      (node): node is HTMLDivElement => Boolean(node)
    );
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const step = Number(entry.target.getAttribute("data-step"));
            setActiveIndex(step);
          }
        });
      },
      { threshold: 0.5 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#040404] px-4 py-24 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 opacity-60">
        <AnimatedGrid />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.15),_transparent_55%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-orange-200">
                Operating system
              </p>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                How we help you ship unforgettable experiences
              </h2>
              <p className="mt-4 text-sm text-gray-300">
                This is the end-to-end playbook used by our top organizers —
                from scoping to post-event monetization.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.35em] text-gray-300">
                Proven impact
              </p>
              <div className="mt-4 grid gap-4">
                {metrics.map((metric) => (
                  <div key={metric.label}>
                    <p className="text-3xl font-semibold">{metric.value}</p>
                    <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/5 bg-black/50 p-6">
              <p className="text-sm font-semibold text-white">Playbook deliverables</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                <li>• Templates for launch briefs, run-of-show, and partner decks</li>
                <li>• Automations covering tickets, payouts, and compliance</li>
                <li>• Embedded analytics for every stakeholder</li>
              </ul>
            </div>
          </div>

          <div className="space-y-10">
            <div className="relative">
              <div className="pointer-events-none absolute left-7 top-0 hidden h-full w-px bg-gradient-to-b from-orange-300/40 via-white/20 to-transparent lg:block" />
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.number}
                    data-step={step.number}
                    ref={(node) => {
                      cardRefs.current[index] = node;
                    }}
                    className="relative rounded-3xl border border-white/10 bg-black/70 p-6 backdrop-blur md:p-8"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <motion.span
                      className="absolute -left-1 -top-1 flex h-10 w-10 items-center justify-center rounded-2xl border-2 text-base font-semibold"
                      animate={{
                        borderColor:
                          activeIndex === step.number
                            ? "rgba(251,146,60,1)"
                            : "rgba(255,255,255,0.2)",
                        color:
                          activeIndex === step.number
                            ? "rgba(255,255,255,1)"
                            : "rgba(255,255,255,0.8)",
                        scale: activeIndex === step.number ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.number}
                    </motion.span>
                    <div className="md:flex md:items-start md:justify-between md:gap-8">
                      <div className="md:flex-1">
                        <h3 className="text-2xl font-semibold">{step.title}</h3>
                        <ul className="mt-4 space-y-3 text-sm text-gray-300">
                          {step.points.map((point) => (
                            <li key={point} className="flex items-start gap-3">
                              <FaCheckCircle className="mt-0.5 text-orange-200" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Link
                        href={step.ctaHref}
                        className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white md:mt-0"
                      >
                        {step.buttonText}
                        <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {signals.map((signal) => (
                <div
                  key={signal.title}
                  className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-transparent to-black/60 p-5 text-sm text-gray-300"
                >
                  <p className="text-base font-semibold text-white">{signal.title}</p>
                  <p className="mt-2">{signal.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeHelp;
