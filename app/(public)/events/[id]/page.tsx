import { fetchEvents, getEventById } from '@/lib/firestore';
import { EventDetail } from '@/components/events/EventDetail';

export async function generateStaticParams() {
  const events = await fetchEvents();
  return events.map((item: any) => ({ id: item.id }));
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event: any = await getEventById(params.id);
  const allEvents: any[] = await fetchEvents();

  if (!event) {
    return <div className="max-w-3xl mx-auto py-8 px-4">Event not found.</div>;
  }

  // Exclude current event from recent events
  const recentEvents = allEvents.filter((item) => item.id !== event.id).slice(0, 3);

  return <EventDetail event={event} recentEvents={recentEvents} />;
} 