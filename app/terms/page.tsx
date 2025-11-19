import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Eventie",
    description:
        "Review the guidelines and legal agreements for using Eventie products.",
};

const clauses = [
    {
        title: "Eligibility & accounts",
        details:
            "You are responsible for safeguarding login credentials and ensuring your team members only access the features they need.",
    },
    {
        title: "Payments & fees",
        details:
            "Processing fees vary by market and payment rail. Eventie remits payouts according to organizer agreements and local regulations.",
    },
    {
        title: "Acceptable use",
        details:
            "We reserve the right to suspend experiences tied to fraudulent behavior, unsafe conditions, or activity that violates local law.",
    },
    {
        title: "Liability",
        details:
            "Eventie provides software and support services on an as-is basis. Organizers remain responsible for on-site execution and compliance.",
    },
];

const TermsPage = () => (
    <main className="min-h-screen bg-black text-white">
        <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
            <p className="text-sm uppercase tracking-[0.4em] text-orange-200">
                Terms of service
            </p>
            <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">
                Know the ground rules for launching with Eventie.
            </h1>
            <p className="mt-4 text-lg text-gray-300">
                This overview highlights key clauses. For executed contracts or
                country-specific agreements, contact legal@eventie.app.
            </p>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
            <div className="space-y-6">
                {clauses.map((clause) => (
                    <article
                        key={clause.title}
                        className="rounded-3xl border border-white/10 bg-black/70 p-6"
                    >
                        <h2 className="text-2xl font-semibold">{clause.title}</h2>
                        <p className="mt-3 text-sm text-gray-300">{clause.details}</p>
                    </article>
                ))}
            </div>
            <p className="mt-8 text-xs text-gray-400">
                Last updated November 17, 2025. Continued use of Eventie confirms acceptance.
            </p>
        </section>
    </main>
);

export default TermsPage;


