import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Partners | Eventie",
    description:
        "Explore sponsorship tiers, venue alliances, and platform integrations with Eventie.",
};

const tiers = [
    {
        name: "Signal partners",
        description: "Global and regional brands wanting to activate across multiple cities.",
        perks: [
            "Dedicated partner success pod",
            "Custom reporting & attribution",
            "Joint marketing rights",
        ],
    },
    {
        name: "Venue alliances",
        description: "Venue groups standardizing operations on Eventie for predictable launches.",
        perks: [
            "Centralized payouts & invoicing",
            "Preferred placement across discovery surfaces",
            "Resource library for staff onboarding",
        ],
    },
    {
        name: "Integration partners",
        description: "Tools that connect to Eventie’s APIs—POS, CRM, finance, and logistics.",
        perks: [
            "Sandbox + shared success metrics",
            "Co-selling with enterprise teams",
            "Technical validation & certification",
        ],
    },
];

const PartnersPage = () => (
    <main className="min-h-screen bg-black text-white">
        <section className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
            <p className="text-sm uppercase tracking-[0.4em] text-orange-200">Partners</p>
            <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">
                Unlock premium placement, deeper insights, and reliable launches.
            </h1>
            <p className="mt-4 text-lg text-gray-300">
                Whether you manage venues, power hospitality, or sponsor culture, Eventie
                gives you a transparent system to collaborate with organizers.
            </p>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
                {tiers.map((tier) => (
                    <article
                        key={tier.name}
                        className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 via-black/60 to-black/80 p-6"
                    >
                        <h2 className="text-2xl font-semibold">{tier.name}</h2>
                        <p className="mt-3 text-sm text-gray-300">{tier.description}</p>
                        <ul className="mt-6 space-y-2 text-sm text-gray-200">
                            {tier.perks.map((perk) => (
                                <li key={perk}>• {perk}</li>
                            ))}
                        </ul>
                        <p className="mt-6 text-sm text-orange-200">partners@eventie.app</p>
                    </article>
                ))}
            </div>
        </section>
    </main>
);

export default PartnersPage;


