import React from "react";

type Testimonial = {
    quote: string;
    author: string;
    role: string;
    metric: string;
    result: string;
};

const testimonials: Testimonial[] = [
    {
        quote:
            "Eventie removed the busywork from our festival launch. Ticketing, comms, and on-site check-ins all lived in one dashboard.",
        author: "Imani Okeke",
        role: "Co-founder, Vibes In Lagos",
        metric: "12K+",
        result: "tickets confirmed in 36 hours",
    },
    {
        quote:
            "We grew our tech community from a Telegram chat into a paid membership experience. Attendee insights now drive every event decision.",
        author: "Samuel K.",
        role: "Lead Organizer, DevCon Accra",
        metric: "4.8/5",
        result: "average attendee satisfaction",
    },
    {
        quote:
            "Payments clear instantly, sponsors get custom reporting, and our team finally has predictable processes.",
        author: "Lerato Mahlangu",
        role: "Head of Experience, Jozi Collective",
        metric: "38%",
        result: "reduction in ops costs",
    },
];

const Testimonials = () => {
    return (
        <section className="bg-[#050505] py-20 px-4 text-white">
            <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-3xl mx-auto">
                    <p className="text-sm uppercase tracking-widest text-orange-200">
                        Proof it works
                    </p>
                    <h2 className="mt-4 text-3xl md:text-4xl font-bold">
                        Trusted by teams building culture across African cities
                    </h2>
                    <p className="mt-3 text-gray-400">
                        Real organizers, venue owners, and community builders choose Eventie
                        to remove risk from every launch.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <article
                            key={testimonial.author}
                            className="rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent p-6"
                        >
                            <div className="flex items-baseline justify-between text-orange-200">
                                <span className="text-3xl font-bold">{testimonial.metric}</span>
                                <span className="text-xs uppercase tracking-[0.25em] text-gray-400">
                                    Impact
                                </span>
                            </div>
                            <p className="mt-4 text-lg leading-relaxed text-gray-100">
                                “{testimonial.quote}”
                            </p>
                            <p className="mt-4 text-sm text-gray-400">{testimonial.result}</p>
                            <div className="mt-6">
                                <p className="font-semibold">{testimonial.author}</p>
                                <p className="text-sm text-gray-400">{testimonial.role}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;


