"use client";

import Link from 'next/link';
import { useTranslation } from "@/hooks/useTranslation";
import { TranslatableText } from "@/components/translatable-content";
import Image from 'next/image';

interface EventDetailProps {
  event: any;
  recentEvents: any[];
}

export function EventDetail({ event, recentEvents }: EventDetailProps) {
  const { currentLang } = useTranslation();

  // Helper function to get the correct language text
  const getLocalizedText = (text: string | { en: string; el: string }, lang: string): string => {
    if (typeof text === 'string') {
      return text;
    }
    return text[lang as keyof typeof text] || text.en || '';
  };

  const hasSidebar = recentEvents.length > 0;
  const eventDate = event.date?.seconds ? new Date(event.date.seconds * 1000) : new Date(event.date);
  const title = getLocalizedText(event.title, currentLang);
  const description = getLocalizedText(event.description, currentLang);
  const location = getLocalizedText(event.location, currentLang);

  return (
    <div className={`w-full py-8 px-2 sm:px-4 bg-background min-h-screen`}>
      <div className={`w-full grid grid-cols-1 ${hasSidebar ? 'lg:grid-cols-[2fr_1fr]' : ''} gap-8 lg:gap-12 max-w-7xl mx-auto`}>
        {/* Main Content */}
        <div className={hasSidebar ? 'lg:col-span-1' : 'lg:col-span-2'}>
          {event.imageUrl && (
            <Image
              src={event.imageUrl}
              alt={title}
              width={800}
              height={320}
              className="mb-6 w-full h-56 sm:h-72 md:h-80 object-cover rounded-xl border border-border"
              unoptimized
            />
          )}
          <nav className="mb-4 text-sm text-body/70 flex items-center gap-2">
            <Link href="/" className="hover:underline">
              <TranslatableText>Home</TranslatableText>
            </Link>
            <span>/</span>
            <Link href="/events" className="hover:underline">
              <TranslatableText>Events</TranslatableText>
            </Link>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-heading leading-tight">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 text-sm text-body/70">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              {eventDate.toLocaleDateString()}
            </span>
            {event.time && (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                {event.time}
                {event.endTime && ` - ${event.endTime}`}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                {currentLang === 'el' ? 'στην' : 'at'} {location}
              </span>
            )}
          </div>
          <div className="prose prose-lg text-body mb-8" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
        {/* Sidebar */}
        {hasSidebar && (
          <aside className="space-y-6 w-full max-w-md mx-auto lg:mx-0 lg:w-auto">
            <h2 className="text-lg font-bold mb-4 text-heading">
              <TranslatableText>Recent Events</TranslatableText>
            </h2>
            <div className="space-y-4">
              {recentEvents.map((item) => {
                const itemDate = item.date?.seconds ? new Date(item.date.seconds * 1000) : new Date(item.date);
                const itemTitle = getLocalizedText(item.title, currentLang);
                const itemLocation = getLocalizedText(item.location, currentLang);
                return (
                  <Link key={item.id} href={`/events/${item.id}`} className="flex gap-4 rounded-lg bg-card hover:bg-accent/10 transition p-2 group">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={itemTitle}
                        width={112}
                        height={80}
                        className="w-28 h-20 object-cover rounded-md flex-shrink-0"
                        unoptimized
                      />
                    ) : (
                      <div className="w-28 h-20 bg-muted flex items-center justify-center rounded-md text-body/40 text-xs">
                        <TranslatableText>No Image</TranslatableText>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold uppercase text-link mb-1 block">
                        {item.category || (currentLang === 'el' ? 'Εκδήλωση' : 'Event')}
                      </span>
                      <h3 className="text-md font-bold text-heading mb-1 group-hover:underline line-clamp-2">
                        {itemTitle}
                      </h3>
                      <span className="text-xs text-body/70">
                        {itemDate.toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
} 