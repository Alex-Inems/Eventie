import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Security | Eventie",
    description:
        "Learn about Eventie’s security practices, compliance roadmap, and responsible disclosure program.",
};

const pillars = [
    {
        title: "Infrastructure",
        body: "Hosted on SOC 2 compliant providers with network segmentation, WAF protections, and automated patching.",
    },
    {
        title: "Application",
        body: "Static analysis, dependency scanning, and manual reviews guard every release. Secrets never live in code.",
    },
    {
        title: "People & process",
        body: "Least-privilege access, background checks for sensitive roles, and mandatory security training.",
    },
];

const SecurityPage = () => (
    <main className="min-h-screen bg-black text-white">
        <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
            <p className="text-sm uppercase tracking-[0.4em] text-orange-200">Security</p>
            <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">
                Production-grade protection for every event.
            </h1>
            <p className="mt-4 text-lg text-gray-300">
                Eventie follows industry best practices for protecting organizer data,
                attendee payments, and partner workflows.
            </p>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-3">
                {pillars.map((pillar) => (
                    <article
                        key={pillar.title}
                        className="rounded-3xl border border-white/10 bg-black/70 p-6"
                    >
                        <h2 className="text-xl font-semibold">{pillar.title}</h2>
                        <p className="mt-3 text-sm text-gray-300">{pillar.body}</p>
                    </article>
                ))}
            </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-white/10 bg-black/60 p-6">
                <h2 className="text-2xl font-semibold">Responsible disclosure</h2>
                <p className="mt-3 text-sm text-gray-300">
                    Found a vulnerability? Email security@eventie.app with clear reproduction
                    steps. We respond within two business days and credit all eligible researchers.
                </p>
                <p className="mt-4 text-sm text-orange-200">
                    Upcoming: SOC 2 Type II audit · PCI DSS update Q1 2026.
                </p>
            </div>
        </section>
    </main>
);

export default SecurityPage;


