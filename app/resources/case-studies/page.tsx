import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Case Studies | Eventie Resources",
    description:
        "See how organizers, venue groups, and sponsors ship complex experiences with Eventie.",
};

const studies = [
    {
        name: "Vibes In Lagos",
        metric: "12K+ tickets",
        summary:
            "Scaled from neighborhood pop-ups to multi-day festivals using centralized ticketing and payouts.",
    },
    {
        name: "DevCon Accra",
        metric: "4.8/5 NPS",
        summary:
            "Built a hybrid membership model that keeps their community warm between flagship events.",
    },
    {
        name: "Jozi Collective",
        metric: "38% ops savings",
        summary:
            "Unified communications, vendors, and sponsor dashboards across ten venues.",
    },
];

const CaseStudiesPage = () => (
    <main className="min-h-screen bg-black text-white">
        <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
            <p className="text-sm uppercase tracking-[0.4em] text-orange-200">
                Case studies
            </p>
            <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">
                Proof that Eventie removes risk at every scale.
            </h1>
            <p className="mt-4 text-lg text-gray-300">
                We partner with teams launching fashion shows, tech conferences, underground
                parties, and city-wide festivals. Explore what they ship with our stack.
            </p>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
            <div className="space-y-6">
                {studies.map((study) => (
                    <article
                        key={study.name}
                        className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-black/60 to-black/80 p-6"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-2xl font-semibold">{study.name}</h2>
                            <span className="text-sm uppercase tracking-[0.35em] text-orange-200">
                                {study.metric}
                            </span>
                        </div>
                        <p className="mt-3 text-sm text-gray-300">{study.summary}</p>
                        <p className="mt-4 text-sm text-orange-200">
                            Deep dives available on request via partners@eventie.app
                        </p>
                    </article>
                ))}
            </div>
        </section>
    </main>
);

export default CaseStudiesPage;


