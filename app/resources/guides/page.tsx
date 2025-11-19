import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Guides | Eventie Resources",
    description:
        "Download templates and frameworks that help teams deliver unforgettable experiences.",
};

const guides = [
    {
        title: "Organizer OS Playbook",
        length: "38 pages",
        summary:
            "Backstage workflows, staffing plans, and budget tracking used by our top organizers.",
    },
    {
        title: "Sponsorship Readiness Checklist",
        length: "14 pages",
        summary:
            "Everything a brand partner needs to say yes—audience data, deliverables, and reporting.",
    },
    {
        title: "Venue Onboarding Bundle",
        length: "22 pages",
        summary:
            "Turn any venue into a production-ready space with sample contracts and compliance docs.",
    },
];

const GuidesPage = () => (
    <main className="min-h-screen bg-black text-white">
        <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
            <p className="text-sm uppercase tracking-[0.4em] text-orange-200">Guides</p>
            <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">
                Templated, battle-tested documentation.
            </h1>
            <p className="mt-4 text-lg text-gray-300">
                Grab the same resources we share with organizers inside Eventie. Use them
                as-is or remix them for your team.
            </p>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
            <div className="space-y-6">
                {guides.map((guide) => (
                    <article
                        key={guide.title}
                        className="rounded-3xl border border-white/10 bg-black/70 p-6"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-2xl font-semibold">{guide.title}</h2>
                            <span className="rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-300">
                                {guide.length}
                            </span>
                        </div>
                        <p className="mt-3 text-sm text-gray-300">{guide.summary}</p>
                        <p className="mt-4 text-sm text-orange-200">
                            Download available inside Organizer Dashboard.
                        </p>
                    </article>
                ))}
            </div>
        </section>
    </main>
);

export default GuidesPage;


