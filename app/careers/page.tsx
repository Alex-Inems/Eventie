import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Careers at Eventie | Build the future of live experiences",
    description:
        "Join a distributed team crafting tools for organizers, venues, and communities across Africa.",
};

const roles = [
    {
        title: "Senior Product Designer",
        location: "Remote · Lagos / Nairobi overlap",
        type: "Full time",
        summary:
            "Own end-to-end experience design for organizer and attendee flows, from research to polished interfaces.",
    },
    {
        title: "Accounts Executive (Venues)",
        location: "Johannesburg",
        type: "Hybrid",
        summary:
            "Build long-term relationships with venue partners, lead onboarding, and ensure high-velocity launches.",
    },
    {
        title: "Payments Engineer",
        location: "Remote",
        type: "Full time",
        summary:
            "Ship reliable payment rails, payout automation, and compliance reporting across multiple currencies.",
    },
];

const perks = [
    "Work from anywhere with quarterly in-person build weeks",
    "Learning stipends and access to partner events",
    "Wellness allowance and flexible PTO",
    "Scaled ownership via equity grants",
];

const CareersPage = () => (
    <main className="min-h-screen bg-black text-white">
        <section className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
            <p className="text-sm uppercase tracking-[0.4em] text-orange-200">
                Careers
            </p>
            <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">
                Build tools for the people who build culture.
            </h1>
            <p className="mt-4 text-lg text-gray-300">
                We’re a multi-city team of operators, engineers, designers, and producer-types
                who believe unforgettable experiences deserve better software.
            </p>
        </section>

        <section className="border-y border-white/5 bg-gradient-to-r from-white/5 via-transparent to-white/5">
            <div className="mx-auto grid max-w-5xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-black/70 p-6">
                    <h2 className="text-2xl font-semibold">How we work</h2>
                    <p className="mt-3 text-sm text-gray-300">
                        Eventie is remote-first with anchor hubs in Lagos, Nairobi, and Johannesburg.
                        We value thoughtful async collaboration, frequent prototypes, and meeting our
                        community where they are.
                    </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/70 p-6">
                    <h2 className="text-2xl font-semibold">Benefits &amp; growth</h2>
                    <ul className="mt-4 space-y-2 text-sm text-gray-300">
                        {perks.map((perk) => (
                            <li key={perk}>• {perk}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6">
                {roles.map((role) => (
                    <article
                        key={role.title}
                        className="rounded-3xl border border-white/10 bg-black/70 p-6"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h3 className="text-2xl font-semibold">{role.title}</h3>
                                <p className="text-sm text-gray-400">{role.location}</p>
                            </div>
                            <span className="rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-300">
                                {role.type}
                            </span>
                        </div>
                        <p className="mt-4 text-sm text-gray-300">{role.summary}</p>
                        <p className="mt-4 text-sm text-orange-200">
                            Send your portfolio or resume to talent@eventie.app
                        </p>
                    </article>
                ))}
            </div>
        </section>
    </main>
);

export default CareersPage;


