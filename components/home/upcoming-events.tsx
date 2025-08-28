'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchEvents } from '@/lib/firestore';
import { useTranslation } from '@/hooks/useTranslation';
import { TranslatableText } from '@/components/translatable-content';
import { Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  optimizedAnimations, 
  animationVariants, 
  gpuAccelerationClasses,
  animationPerformance 
} from '@/lib/animation-utils';
import { getEventsSectionImage, getEventsSectionImageSync } from '@/lib/appearance-utils';

const getLocalizedText = (text: string | { en: string; el: string }, lang: string): string => {
  if (typeof text === 'string') {
    return text;
  }
  if (typeof text === 'object' && text !== null && 'en' in text && 'el' in text) {
    return text[lang as keyof typeof text] || text.en || '';
  }
  return '';
};

export function UpcomingEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { currentLang } = useTranslation();
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    async function loadEventsSectionImage() {
      try {
        // First try to get from Firestore
        const { getAppearanceSettingsFromFirestore } = await import('@/lib/firestore');
        const firestoreSettings = await getAppearanceSettingsFromFirestore();
        
        if (firestoreSettings) {
          setBackgroundImage(firestoreSettings.eventsSectionImage || '');
        } else {
          // Fallback to sync method which uses localStorage
          const eventsSectionImage = getEventsSectionImageSync();
          setBackgroundImage(eventsSectionImage || '');
        }
      } catch (error) {
        console.error('Error loading events section image:', error);
        // No fallback - let the section work without background image
        setBackgroundImage('');
      }
    }
    
    loadEventsSectionImage();
  }, []);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      const data = await fetchEvents();
      // Normalize publishDate to always be a Date object
      const normalized = data.map(event => ({
        ...event,
        publishDate: event.publishDate
          ? (event.publishDate.seconds
              ? event.publishDate.seconds * 1000
              : new Date(event.publishDate).getTime())
          : 0,
      }));
      setEvents(normalized);
      setLoading(false);
    }
    loadEvents();
  }, [currentLang]);

  const now = Date.now();
  const upcomingEvents = events
    .filter(item => {
      // Must be featured
      if (!item.featured) return false;

      // Must have a valid publishDate and event date
      const publishDate = item.publishDate
        ? (item.publishDate.seconds
            ? item.publishDate.seconds * 1000
            : typeof item.publishDate === 'string'
              ? new Date(item.publishDate).getTime()
              : item.publishDate)
        : null;

      const eventDate = item.date
        ? (item.date.seconds
            ? item.date.seconds * 1000
            : typeof item.date === 'string'
              ? new Date(item.date).getTime()
              : item.date)
        : null;

      // Both dates must be valid numbers
      if (!publishDate || isNaN(publishDate)) return false;
      if (!eventDate || isNaN(eventDate)) return false;

      // Publish date must be in the past, event date must be in the future
      return publishDate <= now && eventDate >= now;
    })
    .sort((a, b) => {
      const aDate = a.date?.seconds ? a.date.seconds * 1000 : new Date(a.date).getTime();
      const bDate = b.date?.seconds ? b.date.seconds * 1000 : new Date(b.date).getTime();
      return aDate - bDate;
    });
  // Determine if we need a slider (more than 4 events)
  const needsSlider = upcomingEvents.length > 4;
  const eventsToShow = needsSlider ? upcomingEvents : upcomingEvents.slice(0, 4);
  // Calculate slides for slider
  const slides = needsSlider ? Math.ceil(upcomingEvents.length / 4) : 1;
  // Get current slide events
  const getCurrentSlideEvents = () => {
    if (!needsSlider) return eventsToShow;
    const startIndex = currentSlide * 4;
    return upcomingEvents.slice(startIndex, startIndex + 4);
  };
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides);
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides) % slides);
  };

  useEffect(() => {
    if (!needsSlider) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [needsSlider, currentSlide, slides]);

  return (
    <section className="py-16 bg-background bg-center bg-cover relative animate-fade-in-up" style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none' }}>
      <div className={`absolute inset-0 ${backgroundImage ? 'bg-white/80 backdrop-blur-sm' : 'bg-gray-50'} z-0`} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-left mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-heading mb-2">
            <TranslatableText>Upcoming Events</TranslatableText>
          </h2>
          <p className="text-lg text-body/70 max-w-3xl">
            <TranslatableText>Event management is the application of project management to the creation and development of small and/or large-scale personal or corporate events.</TranslatableText>
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-primary text-lg">
              <TranslatableText>Loading...</TranslatableText>
            </p>
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-primary text-lg">
              <TranslatableText>No upcoming events found.</TranslatableText>
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Debug info - remove in production */}
            {needsSlider && (
              <div className="text-left mb-4 text-sm text-gray-600">
                Slide {currentSlide + 1} of {slides} (Total events: {upcomingEvents.length})
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8">
              <AnimatePresence mode="wait">
                {getCurrentSlideEvents().map((event, idx) => {
                  const eventDate = event.date?.seconds ? new Date(event.date.seconds * 1000) : new Date(event.date);
                  const day = eventDate.getDate();
                  const month = eventDate.toLocaleString('default', { month: 'short' });
                  const time = event.time || (eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ 
                        ...optimizedAnimations.standard,
                        delay: idx * 0.05,
                        ...animationPerformance.getReducedMotionConfig()
                      }}
                      className={`relative rounded-2xl overflow-hidden shadow-xl group transition-shadow duration-200 bg-black/80 hover:shadow-2xl min-h-[380px] sm:min-h-[400px] lg:min-h-[420px] flex flex-col justify-end ${gpuAccelerationClasses.gpu}`}
                    >
                      {event.imageUrl && (
                        <Image
                          src={event.imageUrl}
                          alt={getLocalizedText(event.title, currentLang)}
                          className="absolute inset-0 w-full h-full object-cover z-0"
                          width={600}
                          height={338}
                          sizes="(max-width: 768px) 100vw, 25vw"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/60 z-10" />
                      <div className="relative z-20 flex flex-col h-full justify-between p-4 sm:p-5 lg:p-6">
                        <div>
                          <Badge className="bg-indigo-600 text-white text-xs px-2 sm:px-3 py-1 rounded shadow z-30 mb-2 sm:mb-3">{event.category}</Badge>
                          <h3 className="text-xl sm:text-2xl lg:text-2xl font-extrabold text-white mb-2 drop-shadow-lg leading-tight">
                            <a href={`/events/${event.id}`} className="hover:underline focus:underline transition-colors duration-150">{getLocalizedText(event.title, currentLang)}</a>
                          </h3>
                        </div>
                        <div className="flex items-end justify-between w-full mt-auto pt-4 sm:pt-6 lg:pt-8">
                          <div className="flex flex-col items-center justify-end">
                            <span className="text-2xl sm:text-3xl font-bold text-white leading-none">{day}</span>
                            <span className="text-sm sm:text-lg font-semibold text-white uppercase tracking-wide -mt-1">{month}</span>
                          </div>
                          <div className="flex flex-col items-end text-right">
                            <span className="text-white text-xs sm:text-sm font-medium mb-1">{time}{event.endTime ? ` – ${event.endTime}` : ''}</span>
                            <span className="text-white text-xs font-medium">at {getLocalizedText(event.location, currentLang)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {/* Slider Dots and Navigation - Only show if slider is needed */}
            {needsSlider && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={prevSlide}
                  className="bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 border border-gray-200"
                  aria-label="Previous events"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-3">
                  {Array.from({ length: slides }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`w-4 h-4 rounded-full transition-all duration-200 border-2 ${
                        i === currentSlide 
                          ? 'bg-primary border-primary scale-125' 
                          : 'bg-white border-gray-300 hover:border-gray-400 hover:scale-110'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={nextSlide}
                  className="bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 border border-gray-200"
                  aria-label="Next events"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center mt-8">
          <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out" asChild>
            <Link href="/events">
              <TranslatableText>View All Events</TranslatableText>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}