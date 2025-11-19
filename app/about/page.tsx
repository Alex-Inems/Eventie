import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Eventie | Building culture across African cities",
    description:
        "Meet the team building Eventie, the operating system for unforgettable experiences across the continent.",
};

const values = [
    {
        title: "Local-first",
        description:
            "We invest in organizers, venues, and creatives in the cities we serve before expanding to new markets.",
    },
    {
        title: "Operational rigor",
        description:
            "Events are living systems. We design software that reduces chaos for every backstage crew member.",
    },
    {
        title: "Trust by design",
        description:
            "Payment flows, vendor access, and attendee data are handled with compliance-grade standards.",
    },
];

const milestones = [
    { year: "2021", detail: "Eventie prototype launched in Lagos with 12 beta organizers." },
    { year: "2022", detail: "Scaled to four cities and processed our first 50K tickets." },
    { year: "2023", detail: "Opened Nairobi office and launched the organizer operating system." },
    { year: "2024", detail: "Partnered with venue groups and introduced payouts in 5 currencies." },
];

const AboutPage = () => (
    <main className="min-h-screen bg-black text-white">
        <section className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
            <p className="text-sm uppercase tracking-[0.4em] text-orange-200">
                Our mission
            </p>
            <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">
                Give every cultural architect the tools to launch with confidence.
            </h1>
            <p className="mt-4 text-lg text-gray-300">
                Eventie is a distributed team spanning Lagos, Nairobi, Accra, Johannesburg,
                and remote collaborators across the continent. We ship software, service,
                and playbooks that help communities find each other offline.
            </p>
        </section>

        <section className="border-y border-white/5 bg-gradient-to-r from-white/5 via-transparent to-white/5">
            <div className="mx-auto grid max-w-5xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-3">
                {values.map((value) => (
                    <article
                        key={value.title}
                        className="rounded-2xl border border-white/10 bg-black/60 p-6"
                    >
                        <h3 className="text-xl font-semibold">{value.title}</h3>
                        <p className="mt-3 text-sm text-gray-300">{value.description}</p>
                    </article>
                ))}
            </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-10 md:grid-cols-[0.75fr_1fr]">
                <div>
                    <h2 className="text-2xl font-semibold">What drives us</h2>
                    <p className="mt-3 text-sm text-gray-300">
                        Event organizers juggle dozens of tools and last-minute surprises.
                        We think African events deserve the same production-grade tooling
                        available to teams everywhere else—customized to the realities on the ground.
                    </p>
                </div>
                <div className="space-y-4">
                    {milestones.map((milestone) => (
                        <div
                            key={milestone.year}
                            className="rounded-2xl border border-white/10 bg-black/70 p-5"
                        >
                            <p className="text-sm uppercase tracking-[0.35em] text-orange-200">
                                {milestone.year}
                            </p>
                            <p className="mt-2 text-base text-gray-200">{milestone.detail}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    </main>
);

export default AboutPage;


