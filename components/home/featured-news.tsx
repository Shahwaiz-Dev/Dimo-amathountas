'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { fetchNews } from '@/lib/firestore';
import { useTranslation } from '@/hooks/useTranslation';
import { TranslatableText } from '@/components/translatable-content';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function FeaturedNews() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentLang } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Helper function to get the correct language text
  const getLocalizedText = useCallback((text: string | { en: string; el: string } | undefined | null, lang: string): string => {
    if (!text) return '';
    if (typeof text === 'string') {
      return text;
    }
    return text[lang as keyof typeof text] || text.en || '';
  }, []);

  // Only show featured news where publishDate <= now
  const now = Date.now();
  const featuredNews = news.filter(item => {
    const publishDate = item.publishDate?.seconds ? item.publishDate.seconds * 1000 : new Date(item.publishDate).getTime();
    return item.featured && publishDate <= now;
  });
  const needsSlider = featuredNews.length > 4;
  const slides = needsSlider ? Math.ceil(featuredNews.length / 4) : 1;
  const getCurrentSlideNews = () => {
    if (!needsSlider) return featuredNews;
    const startIndex = currentSlide * 4;
    return featuredNews.slice(startIndex, startIndex + 4);
  };
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides) % slides);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      const data = await fetchNews();
      setNews(data);
      setLoading(false);
    }
    loadNews();
  }, [currentLang]);

  useEffect(() => {
    if (!needsSlider) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [needsSlider, currentSlide, slides]);

  return (
    <section className="py-16 bg-background animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <h2 className="text-3xl font-bold text-heading mb-4">
            <TranslatableText>Featured News</TranslatableText>
          </h2>
          <p className="text-lg text-body/70">
            <TranslatableText>Stay updated with our latest announcements and insights</TranslatableText>
          </p>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-primary text-lg">
              <TranslatableText>Loading...</TranslatableText>
            </p>
          </div>
        ) : featuredNews.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-primary text-lg">
              <TranslatableText>No featured news found.</TranslatableText>
            </p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              >
                {getCurrentSlideNews().map((item, idx) => {
                  const title = getLocalizedText(item.title, currentLang);
                  const excerpt = getLocalizedText(item.excerpt, currentLang);
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col rounded-xl overflow-hidden shadow-lg bg-transparent group transition-shadow duration-300 hover:shadow-2xl"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={title}
                          className="h-56 w-full object-cover"
                          width={400}
                          height={224}
                          sizes="(max-width: 768px) 100vw, 25vw"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex items-center justify-center bg-card h-56 w-full text-body/40 text-lg font-semibold select-none">
                          <TranslatableText>No Image</TranslatableText>
                        </div>
                      )}
                      <div className="flex-1 flex flex-col bg-card p-6">
                        <span className="text-xs font-semibold uppercase text-link mb-1">{item.category || (currentLang === 'el' ? 'Νέα' : 'News')}</span>
                        <h3 className="text-xl font-bold text-heading mb-1">
                          <span className="relative inline-block">
                            <span className="transition-all duration-300 ease-in-out">
                              {title}
                            </span>
                            <span className="absolute left-0 bottom-0 h-0.5 bg-primary w-0 transition-all duration-300 group-hover:w-full"></span>
                          </span>
                        </h3>
                        <span className="text-sm text-body/70 mb-4">{item.publishDate && (new Date(item.publishDate.seconds ? item.publishDate.seconds * 1000 : item.publishDate).toLocaleDateString())}</span>
                        <div className="flex-1" />
                        <Link
                          href={`/news/${item.id}`}
                          className="mt-2 text-primary font-semibold flex items-center gap-1 hover:underline group no-underline hover:no-underline focus:no-underline"
                        >
                          <TranslatableText>Continue reading</TranslatableText>
                          <span
                            aria-hidden="true"
                            className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                          >
                            &rarr;
                          </span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
            {/* Slider Dots and Navigation - Only show if slider is needed */}
            <div className="flex flex-col items-center gap-y-4 mt-6">
              {needsSlider && (
                <div className="flex justify-center items-center gap-4">
                  <button
                    onClick={prevSlide}
                    className="bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border border-gray-200"
                    aria-label="Previous news"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-3">
                    {Array.from({ length: slides }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
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
                    className="bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border border-gray-200"
                    aria-label="Next news"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
              <Link href="/news" className="inline-block px-8 py-3 bg-primary text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:bg-blue-600">
                <TranslatableText>View All News</TranslatableText>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}