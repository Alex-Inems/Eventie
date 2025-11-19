import Link from "next/link";

const CallToAction = () => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-r from-orange-500/90 via-rose-500/90 to-purple-700/90 py-16 px-4 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_40%)]" />
            <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
                <p className="text-sm uppercase tracking-[0.35em] text-white/70">
                    Ready when you are
                </p>
                <h2 className="text-3xl md:text-4xl font-semibold">
                    Launch your next event with confidence
                </h2>
                <p className="text-base md:text-lg text-white/90">
                    Build waitlists, sell tickets, manage logistics, and keep every
                    stakeholder aligned from one collaborative workspace.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link
                        href="/events"
                        className="rounded-full bg-white px-8 py-3 text-base font-semibold text-gray-900 transition hover:bg-gray-200"
                    >
                        Explore events
                    </Link>
                    <Link
                        href="/dashboard/organizer"
                        className="rounded-full border border-white/70 px-8 py-3 text-base font-semibold text-white/90 transition hover:border-white"
                    >
                        Book a demo
                    </Link>
                </div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                    Zero setup fees · Pay as you grow
                </p>
            </div>
        </section>
    );
};

export default CallToAction;


