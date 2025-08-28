'use client';

import { fetchNews } from '@/lib/firestore';
import { NewsList } from '@/components/news/NewsList';
import { TranslatableText } from '@/components/translatable-content';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, easeOut } from 'framer-motion';
import { HeartbeatLoader } from '@/components/ui/heartbeat-loader';

type News = {
  id: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
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

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const newsData = (await fetchNews())
          .filter((item: any) => item.id && item.title && item.excerpt)
          .map((item: any) => ({
            ...item,
            publishDate: item.publishDate?.seconds ? item.publishDate.seconds * 1000 : item.publishDate,
            updatedAt: item.updatedAt?.seconds ? item.updatedAt.seconds * 1000 : item.updatedAt,
            createdAt: item.createdAt?.seconds ? item.createdAt.seconds * 1000 : item.createdAt,
          }));
        setNews(newsData);
      } catch (err) {
        console.error('Error loading news:', err);
        setError('Failed to load news articles');
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, []);

  // Memoize the processed news data to prevent unnecessary re-renders
  const processedNews = useMemo(() => {
    const now = Date.now();
    return news.filter(item => {
      const publishDate = item.publishDate?.seconds ? item.publishDate.seconds * 1000 : new Date(item.publishDate).getTime();
      return publishDate <= now;
    });
  }, [news]);

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
                <TranslatableText>Loading news articles...</TranslatableText>
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
                  <span>News</span>
                </nav>
              </motion.div>
              
              <div className="text-center">
                <motion.h1 
                  className="text-4xl md:text-6xl font-extrabold text-white mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <TranslatableText>Latest News</TranslatableText>
                </motion.h1>
              </div>
            </div>
          </section>

          {/* News List */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <NewsList news={processedNews} />
              </motion.div>
            </div>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}