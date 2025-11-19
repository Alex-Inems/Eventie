import Sidebar from '@/components/Sidebar';
import Mobilenav from '@/components/Mobilenav';
import TicketsClient from '@/components/TicketsClient';
import { extractIdFromSlug } from '@/utils/slug';

const TicketsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    const eventId = extractIdFromSlug(slug);

    if (!eventId) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#040404] text-white">
                <div className="text-center">
                    <p className="text-lg text-gray-400">Invalid event.</p>
                </div>
            </div>
        );
    }

    return (
        <main className="relative min-h-screen bg-[#040404] text-white">
            <Sidebar />
            <div className="lg:ml-[320px]">
                <TicketsClient eventId={eventId} />
            </div>
            <Mobilenav />
        </main>
    );
};

export default TicketsPage;


