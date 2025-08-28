"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { TranslatableText } from "@/components/translatable-content";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  optimizedAnimations, 
  animationVariants, 
  gpuAccelerationClasses,
  animationPerformance 
} from '@/lib/animation-utils';

type News = {
  id: string;
  title: string | { en: string; el: string };
  excerpt: string | { en: string; el: string };
  imageUrl?: string;
  publishDate?: any;
  category?: string;
  featured?: boolean;
  published?: boolean;
};

const newsItemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...optimizedAnimations.standard,
      ...animationPerformance.getReducedMotionConfig()
    }
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      ...optimizedAnimations.fast,
      ...animationPerformance.getReducedMotionConfig()
    }
  }
};

// Memoized individual news item component for better performance
const NewsItem = memo(({ item, currentLang, getLocalizedText, index }: { 
  item: News; 
  currentLang: string; 
  getLocalizedText: (text: string | { en: string; el: string }, lang: string) => string;
  index: number;
}) => {
  const title = getLocalizedText(item.title, currentLang);
  const excerpt = getLocalizedText(item.excerpt, currentLang);
  
  return (
    <motion.div 
      className="flex flex-col rounded-xl overflow-hidden shadow-lg bg-transparent"
      variants={newsItemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ 
        delay: index * 0.05,
        ...animationPerformance.getReducedMotionConfig()
      }}
    >
      {item.imageUrl ? (
        <motion.img
          src={item.imageUrl}
          alt={title}
          className={`h-56 w-full object-cover ${gpuAccelerationClasses.gpu}`}
          loading="lazy"
          decoding="async"
          whileHover={{ scale: 1.05 }}
          transition={{ 
            ...optimizedAnimations.fast,
            ...animationPerformance.getReducedMotionConfig()
          }}
        />
      ) : (
        <motion.div 
          className={`flex items-center justify-center bg-card h-56 w-full text-body/40 text-lg font-semibold select-none ${gpuAccelerationClasses.gpu}`}
          whileHover={{ scale: 1.05 }}
          transition={{ 
            ...optimizedAnimations.fast,
            ...animationPerformance.getReducedMotionConfig()
          }}
        >
          <TranslatableText>No Image</TranslatableText>
        </motion.div>
      )}
      <div className="flex-1 flex flex-col bg-card p-6">
        {/* Scheduled badge if in the future */}
        {(() => {
          const now = Date.now();
          const publishDate = item.publishDate?.seconds ? item.publishDate.seconds * 1000 : new Date(item.publishDate).getTime();
          if (publishDate > now) {
            return (
              <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-semibold mb-2">
                <TranslatableText>Scheduled for</TranslatableText>: {new Date(publishDate).toLocaleString()}
              </span>
            );
          }
          return null;
        })()}
        <span className="text-xs font-semibold uppercase text-link mb-1">
          {item.category || (currentLang === 'el' ? 'Νέα' : 'News')}
        </span>
        <h2 className="text-xl font-bold text-heading mb-1 line-clamp-2">
          {title}
        </h2>
        <span className="text-sm text-body/70 mb-4">
          {item.publishDate && (new Date(item.publishDate).toLocaleDateString())}
        </span>
        <div className="flex-1" />
        <motion.a
          href={`/news/${item.id}`}
          className={`mt-2 text-primary font-semibold flex items-center gap-1 ${gpuAccelerationClasses.gpu}`}
          whileHover={{ x: 5 }}
          transition={{ 
            ...optimizedAnimations.fast,
            ...animationPerformance.getReducedMotionConfig()
          }}
        >
          <TranslatableText>Continue reading</TranslatableText>
          <span aria-hidden="true">&rarr;</span>
        </motion.a>
      </div>
    </motion.div>
  );
});

NewsItem.displayName = 'NewsItem';

export function NewsList({ news }: { news: News[] }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState('all');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);
  const { currentLang } = useTranslation();

  // Debounce search input to reduce filtering frequency
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Helper function to get the correct language text - memoized
  const getLocalizedText = useCallback((text: string | { en: string; el: string }, lang: string): string => {
    if (typeof text === 'string') {
      return text;
    }
    return text[lang as keyof typeof text] || text.en || '';
  }, []);

  // Get unique categories
  const categories = useMemo(() => Array.from(new Set(news.map(n => n.category).filter(Boolean))), [news]);

  // Memoize filtered news to prevent unnecessary re-computations
  const filteredNews = useMemo(() => {
    const now = Date.now();
    let filtered = news.filter(item => {
      const publishDate = item.publishDate?.seconds ? item.publishDate.seconds * 1000 : new Date(item.publishDate).getTime();
      return publishDate <= now;
    });
    if (debouncedSearch.trim()) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter((item) => {
        const title = getLocalizedText(item.title, currentLang);
        const excerpt = getLocalizedText(item.excerpt, currentLang);
        return title.toLowerCase().includes(searchLower) ||
               excerpt.toLowerCase().includes(searchLower);
      });
    }
    if (category !== 'all') filtered = filtered.filter(item => item.category === category);
    if (featured) filtered = filtered.filter(item => item.featured);
    if (published) filtered = filtered.filter(item => item.published);
    return filtered;
  }, [news, debouncedSearch, currentLang, getLocalizedText, category, featured, published]);

  // Memoize the search placeholder to prevent re-renders
  const searchPlaceholder = useMemo(() => 
    currentLang === 'el' ? 'Αναζήτηση ειδήσεων...' : 'Search news...', 
    [currentLang]
  );

  return (
    <>
      {/* Modern Filter Bar */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl shadow mb-6">
        <motion.input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-48 px-4 py-2 rounded-lg border border-border bg-white text-body focus:outline-none focus:ring-2 focus:ring-primary shadow"
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        />
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
      </div>
      {/* End Filter Bar */}
      
      <AnimatePresence mode="wait">
        {filteredNews.length === 0 ? (
          <motion.div 
            key="no-results"
            className="flex justify-center items-center h-40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-body text-lg">
              {debouncedSearch ? (
                <TranslatableText>No news articles found matching your search.</TranslatableText>
              ) : (
                <TranslatableText>No news articles found.</TranslatableText>
              )}
            </span>
          </motion.div>
        ) : (
          <motion.div 
            key="news-grid"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {filteredNews.map((item, index) => (
              <NewsItem
                key={item.id}
                item={item}
                currentLang={currentLang}
                getLocalizedText={getLocalizedText}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 