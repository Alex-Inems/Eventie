import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Status | Eventie",
    description:
        "Live status and historical uptime for Eventie services across regions.",
};

const components = [
    {
        name: "Organizer Dashboard",
        status: "Operational",
        region: "Global",
        notes: "All systems go.",
    },
    {
        name: "Ticketing & Checkout",
        status: "Operational",
        region: "Africa West, Africa East",
        notes: "Latency under 300ms.",
    },
    {
        name: "Realtime Messaging",
        status: "Degraded performance",
        region: "Africa South",
        notes: "Intermittent delays under investigation.",
    },
];

const incidents = [
    {
        date: "Nov 05, 2025",
        title: "Webhook retries",
        detail: "Issue affecting Paystack webhook retries. Mitigated in 27 minutes.",
    },
    {
        date: "Oct 22, 2025",
        title: "Organizer dashboard latency",
        detail: "Heavy queries caused dashboard lag. Optimized indexes deployed.",
    },
];

const StatusPage = () => (
    <main className="min-h-screen bg-black text-white">
        <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
            <p className="text-sm uppercase tracking-[0.4em] text-orange-200">Status</p>
            <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">
                Transparent uptime &amp; incident history.
            </h1>
            <p className="mt-4 text-lg text-gray-300">
                Eventie monitors key services around the clock. Subscribe via RSS or email
                for automated updates.
            </p>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-white/10 bg-black/60 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-gray-300">Current system status</p>
                    <span className="rounded-full border border-green-400/40 px-4 py-1 text-xs uppercase tracking-[0.35em] text-green-300">
                        Partially degraded
                    </span>
                </div>
                <div className="mt-6 space-y-4">
                    {components.map((component) => (
                        <article
                            key={component.name}
                            className="rounded-2xl border border-white/10 bg-black/70 p-4"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-base font-semibold">{component.name}</p>
                                    <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
                                        {component.region}
                                    </p>
                                </div>
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${component.status === "Operational"
                                            ? "bg-green-500/10 text-green-300"
                                            : "bg-yellow-500/10 text-yellow-200"
                                        }`}
                                >
                                    {component.status}
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-gray-400">{component.notes}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold">Recent incidents</h2>
            <div className="mt-6 space-y-4">
                {incidents.map((incident) => (
                    <article
                        key={incident.title}
                        className="rounded-2xl border border-white/10 bg-black/70 p-5"
                    >
                        <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
                            {incident.date}
                        </p>
                        <p className="mt-2 text-base font-semibold">{incident.title}</p>
                        <p className="mt-2 text-sm text-gray-300">{incident.detail}</p>
                    </article>
                ))}
            </div>
        </section>
    </main>
);

export default StatusPage;


