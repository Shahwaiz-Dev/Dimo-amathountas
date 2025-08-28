"use client";

import { Badge } from '@/components/ui/badge';
import { useTranslation } from "@/hooks/useTranslation";
import { TranslatableText } from "@/components/translatable-content";
import { memo, useCallback, useMemo } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

interface EventItem {
  id: string;
  title: string | { en: string; el: string };
  imageUrl?: string;
  date: any;
  time?: string;
  endTime?: string;
  category?: string;
  location: string | { en: string; el: string };
  featured?: boolean;
  published?: boolean;
  publishDate?: any; // Added for scheduled events
}

// Memoized individual event item component for better performance
const EventItem = memo(({ item, currentLang, getLocalizedText }: { 
  item: EventItem; 
  currentLang: string; 
  getLocalizedText: (text: string | { en: string; el: string }, lang: string) => string;
}) => {
  const eventDate = item.date?.seconds ? new Date(item.date.seconds * 1000) : new Date(item.date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString(currentLang === 'el' ? 'el-GR' : 'en-US', { month: 'short' });
  const time = item.time || (eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const title = getLocalizedText(item.title, currentLang);
  const location = getLocalizedText(item.location, currentLang);
  // Scheduled badge logic
  const publishDate = item.publishDate?.seconds ? item.publishDate.seconds * 1000 : (item.publishDate ? new Date(item.publishDate).getTime() : null);
  const now = Date.now();
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl bg-black/80 min-h-[340px] flex flex-col justify-end">
      {/* Scheduled badge if in the future */}
      {publishDate && publishDate > now && (
        <span className="absolute top-4 left-4 bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-semibold z-30">
          <TranslatableText>Scheduled for</TranslatableText>: {new Date(publishDate).toLocaleString()}
        </span>
      )}
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover z-0"
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20 flex flex-col h-full justify-between p-6">
        <div>
          <Badge className="bg-indigo-600 text-white text-xs px-3 py-1 rounded shadow z-30 mb-3">
            {item.category || (currentLang === 'el' ? 'Εκδήλωση' : 'Event')}
          </Badge>
          <h2 className="text-2xl md:text-2xl font-extrabold text-white mb-2 drop-shadow-lg leading-tight">
            <a href={`/events/${item.id}`} className="hover:underline focus:underline">
              {title}
            </a>
          </h2>
        </div>
        <div className="flex items-end justify-between w-full mt-auto pt-8">
          <div className="flex flex-col items-center justify-end">
            <span className="text-3xl font-bold text-white leading-none">{day}</span>
            <span className="text-lg font-semibold text-white uppercase tracking-wide -mt-1">{month}</span>
          </div>
          <div className="flex flex-col items-end text-right">
            <span className="text-white text-sm font-medium mb-1">
              {time}{item.endTime ? ` – ${item.endTime}` : ''}
            </span>
            <span className="text-white text-xs font-medium">
              {currentLang === 'el' ? 'στην' : 'at'} {location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

EventItem.displayName = 'EventItem';

export function EventsList({ events }: { events: EventItem[] }) {
  const { currentLang } = useTranslation();
  const [category, setCategory] = useState('all');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Helper function to get the correct language text - memoized
  const getLocalizedText = useCallback((text: string | { en: string; el: string }, lang: string): string => {
    if (typeof text === 'string') {
      return text;
    }
    return text[lang as keyof typeof text] || text.en || '';
  }, []);

  // Get unique categories
  const categories = Array.from(new Set(events.map(e => e.category).filter(Boolean)));

  // Filter events
  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (category !== 'all') filtered = filtered.filter(item => item.category === category);
    if (featured) filtered = filtered.filter(item => item.featured);
    if (published) filtered = filtered.filter(item => item.published);
    if (startDate) filtered = filtered.filter(item => {
      const date = item.date?.seconds ? new Date(item.date.seconds * 1000) : new Date(item.date);
      return date >= new Date(startDate);
    });
    if (endDate) filtered = filtered.filter(item => {
      const date = item.date?.seconds ? new Date(item.date.seconds * 1000) : new Date(item.date);
      return date <= new Date(endDate);
    });
    // Only show events where publishDate <= now
    const now = Date.now();
    filtered = filtered.filter(item => {
      const publishDate = item.publishDate?.seconds ? item.publishDate.seconds * 1000 : (item.publishDate ? new Date(item.publishDate).getTime() : null);
      return !publishDate || publishDate <= now;
    });
    return filtered;
  }, [events, category, featured, published, startDate, endDate]);

  // Memoize the events array to prevent unnecessary re-renders
  const memoizedEvents = useMemo(() => filteredEvents, [filteredEvents]);

  return (
    <>
      {/* Modern Filter Bar */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl shadow mb-6">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-40">Category</SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat as string} value={cat as string}>{cat as string}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Switch checked={featured} onCheckedChange={setFeatured} />
          <span>Featured</span>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={published} onCheckedChange={setPublished} />
          <span>Published</span>
        </div>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        />
        <span>-</span>
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </div>
      {/* End Filter Bar */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {memoizedEvents.map((item: EventItem) => (
          <EventItem
            key={item.id}
            item={item}
            currentLang={currentLang}
            getLocalizedText={getLocalizedText}
          />
        ))}
      </div>
    </>
  );
} 