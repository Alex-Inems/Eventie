import Sidebar from '@/components/Sidebar';
import Mobilenav from '@/components/Mobilenav';
import TicketsClient from '@/components/TicketsClient';

const TicketsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;
  const eventId = resolvedParams?.id;

  if (!eventId) {
    return <div className="text-center py-16">Invalid event ID.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <TicketsClient eventId={eventId} />
      <Mobilenav />
    </div>
  );
};

export default TicketsPage;
