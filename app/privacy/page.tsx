import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Eventie",
    description:
        "Understand how Eventie collects, uses, and protects organizer and attendee data.",
};

const sections = [
    {
        title: "Data we collect",
        text: "Profile information, event metadata, transactional details, and usage analytics that help us secure access and improve the product.",
    },
    {
        title: "How we use data",
        text: "To authenticate users, power event experiences, detect fraud, and personalize recommendations. We never sell personal data.",
    },
    {
        title: "Your controls",
        text: "Access, export, or delete your data anytime. Role-based permissions keep sensitive operations restricted.",
    },
    {
        title: "Security",
        text: "Encryption in transit and at rest, regular penetration testing, and incident response runbooks keep your data protected.",
    },
];

const PrivacyPage = () => (
    <main className="min-h-screen bg-black text-white">
        <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
            <p className="text-sm uppercase tracking-[0.4em] text-orange-200">
                Privacy policy
            </p>
            <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">
                Your trust powers every launch.
            </h1>
            <p className="mt-4 text-lg text-gray-300">
                This summary complements our full policy shared with organizers and partners.
                For legal agreements, reach out to legal@eventie.app.
            </p>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
            <div className="space-y-6">
                {sections.map((section) => (
                    <article
                        key={section.title}
                        className="rounded-3xl border border-white/10 bg-black/70 p-6"
                    >
                        <h2 className="text-2xl font-semibold">{section.title}</h2>
                        <p className="mt-3 text-sm text-gray-300">{section.text}</p>
                    </article>
                ))}
            </div>
            <p className="mt-8 text-xs text-gray-400">
                Updated November 17, 2025. Comprehensive agreements available upon request.
            </p>
        </section>
    </main>
);

export default PrivacyPage;


