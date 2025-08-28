'use client';

import { fetchEvents } from '@/lib/firestore';
import { EventsList } from '@/components/events/EventsList';
import { TranslatableText } from '@/components/translatable-content';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, easeOut } from 'framer-motion';
import { HeartbeatLoader } from '@/components/ui/heartbeat-loader';

type Event = {
  id: string;
  title: string;
  description: string;
  date: any;
  time?: string;
  endTime?: string;
  imageUrl?: string;
  location: string;
  category?: string;
  publishDate?: any; // Added for scheduled events
};

const pageVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

const loadingVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easeOut
    }
  }
};

const errorVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut
    }
  }
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const eventsData = (await fetchEvents())
          .map((item: any) => ({
            ...item,
            date: item.date?.seconds ? item.date.seconds * 1000 : item.date,
            updatedAt: item.updatedAt?.seconds ? item.updatedAt.seconds * 1000 : item.updatedAt,
            createdAt: item.createdAt?.seconds ? item.createdAt.seconds * 1000 : item.createdAt,
          }));
        setEvents(eventsData);
      } catch (err) {
        console.error('Error loading events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  // Memoize the processed events data to prevent unnecessary re-renders
  const processedEvents = useMemo(() => {
    const now = Date.now();
    return events.filter(item => {
      const publishDate = item.publishDate?.seconds ? item.publishDate.seconds * 1000 : (item.publishDate ? new Date(item.publishDate).getTime() : null);
      return !publishDate || publishDate <= now;
    });
  }, [events]);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div 
          key="loading"
          className="min-h-screen bg-background"
          variants={loadingVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div 
                className="mx-auto mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <HeartbeatLoader size="lg" />
              </motion.div>
              <motion.p 
                className="text-lg text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <TranslatableText>Loading events...</TranslatableText>
              </motion.p>
            </div>
          </div>
        </motion.div>
      ) : error ? (
        <motion.div 
          key="error"
          className="min-h-screen bg-background"
          variants={errorVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.p 
                className="text-lg text-red-600 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {error}
              </motion.p>
              <motion.button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Again
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="content"
          className="min-h-screen bg-background"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Hero Section */}
          <section className="relative py-20 bg-blue-600">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <motion.div 
                className="text-white mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <nav className="flex items-center space-x-2 text-sm">
                  <Link href="/" className="hover:underline">Home</Link>
                  <span>&gt;</span>
                  <span>Events</span>
                </nav>
              </motion.div>
              
              <div className="text-center">
                <motion.h1 
                  className="text-4xl md:text-6xl font-extrabold text-white mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <TranslatableText>Upcoming Events</TranslatableText>
                </motion.h1>
              </div>
            </div>
          </section>

          {/* Events List */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <EventsList events={processedEvents} />
              </motion.div>
            </div>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}