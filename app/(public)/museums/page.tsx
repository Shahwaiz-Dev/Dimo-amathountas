'use client';

import { fetchMuseums } from '@/lib/firestore';
import { MuseumsList } from '@/components/museums/MuseumsList';
import { TranslatableText } from '@/components/translatable-content';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, easeOut } from 'framer-motion';
import { HeartbeatLoader } from '@/components/ui/heartbeat-loader';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

type Museum = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  location?: string;
  category?: string;
  accessibility?: boolean;
  published?: boolean;
  featured?: boolean;
  createdAt?: any;
  publishDate?: any;
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

export default function MuseumsPage() {
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentLang } = useTranslation();

  useEffect(() => {
    async function loadMuseums() {
      try {
        setLoading(true);
        const data = await fetchMuseums();
        // Normalize publishDate to always be a timestamp (or null)
        const normalized = data.map(museum => ({
          ...museum,
          publishDate: museum.publishDate?.seconds
            ? museum.publishDate.seconds * 1000
            : (museum.publishDate ? new Date(museum.publishDate).getTime() : null),
          updatedAt: museum.updatedAt?.seconds ? museum.updatedAt.seconds * 1000 : museum.updatedAt,
          createdAt: museum.createdAt?.seconds ? museum.createdAt.seconds * 1000 : museum.createdAt,
        }));
        setMuseums(normalized);
      } catch (error) {
        console.error('Error loading museums:', error);
      } finally {
        setLoading(false);
      }
    }
    loadMuseums();
  }, [currentLang]);

  const publishedMuseums = useMemo(() => {
    const now = Date.now();
    return museums.filter(museum => {
      if (!museum.published) return false;
      let publishDate = null;
      if (museum.publishDate?.seconds) publishDate = museum.publishDate.seconds * 1000;
      else if (typeof museum.publishDate === 'number') publishDate = museum.publishDate;
      else if (typeof museum.publishDate === 'string') publishDate = new Date(museum.publishDate).getTime();
      const show = !publishDate || publishDate <= now;
      return show;
    });
  }, [museums]);

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-background"
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
              <Link href="/" className="hover:underline">
                <TranslatableText>{{ en: "Home", el: "Αρχική" }}</TranslatableText>
              </Link>
              <span>&gt;</span>
              <span><TranslatableText>{{ en: "Museums", el: "Μουσεία" }}</TranslatableText></span>
            </nav>
          </motion.div>
          
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-extrabold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TranslatableText>{{ en: "Museums and Places", el: "Μουσεία και Χώροι" }}</TranslatableText>
            </motion.h1>
            <motion.p 
              className="text-xl text-blue-100 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <TranslatableText>{{ en: "Open, fully accessible cultural centers", el: "Ανοιχτά, πλήρως προσβάσιμα πολιτιστικά κέντρα" }}</TranslatableText>
            </motion.p>
          </div>
        </div>
      </section>

      {/* Museums List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <HeartbeatLoader size="lg" />
            </div>
          ) : (
            publishedMuseums.length > 0 ? (
              <MuseumsList museums={publishedMuseums} />
            ) : (
              <div className="text-center py-12">
                <p className="text-dark-brown text-lg">
                  <TranslatableText>{{ en: "No museums available at the moment.", el: "Δεν υπάρχουν διαθέσιμα μουσεία αυτή τη στιγμή." }}</TranslatableText>
                </p>
              </div>
            )
          )}
        </div>
      </section>
    </motion.div>
  );
} 