'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, Search } from 'lucide-react';
import { useContentStore } from '@/lib/store';
import { formatDate, getLocalizedText } from '@/lib/utils';

export function EventsGrid() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { events } = useContentStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const filteredEvents = events
    .filter(item => item.published)
    .filter(item => {
      const title = getLocalizedText(item.title);
      const description = getLocalizedText(item.description);
      return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             description.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="bg-white hover:shadow-lg transition-shadow border-soft-orange">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-warm-terracotta text-white">{event.category}</Badge>
              </div>
              <CardTitle className="line-clamp-2 text-dark-brown">{getLocalizedText(event.title)}</CardTitle>
              <CardDescription className="line-clamp-3 text-dark-brown">{getLocalizedText(event.description)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-dark-brown">
                  <Calendar className="h-4 w-4 text-warm-terracotta" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center gap-2 text-sm text-dark-brown">
                  <MapPin className="h-4 w-4 text-warm-terracotta" />
                  {getLocalizedText(event.location)}
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" asChild>
                <Link href={`/events/${event.id}`}>Learn More</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-dark-brown">No events found matching your search.</p>
        </div>
      )}
    </div>
  );
}