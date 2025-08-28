"use client";

import Link from 'next/link';
import { useTranslation } from "@/hooks/useTranslation";
import { TranslatableText } from "@/components/translatable-content";
import Image from 'next/image';

interface NewsDetailProps {
  news: any;
  recentNews: any[];
}

export function NewsDetail({ news, recentNews }: NewsDetailProps) {
  const { currentLang } = useTranslation();

  // Helper function to get the correct language text
  const getLocalizedText = (text: string | { en: string; el: string } | null | undefined, lang: string): string => {
    if (!text) return '';
    if (typeof text === 'string') {
      return text;
    }
    if (text && typeof text === 'object' && (text.en || text.el)) {
      return text[lang as keyof typeof text] || text.en || text.el || '';
    }
    return '';
  };

  const hasSidebar = recentNews.length > 0;
  const title = getLocalizedText(news.title, currentLang);
  const content = getLocalizedText(news.content, currentLang);

  return (
    <div className={`w-full py-8 px-2 sm:px-4 bg-background min-h-screen`}>
      <div className={`w-full grid grid-cols-1 ${hasSidebar ? 'lg:grid-cols-[2fr_1fr]' : ''} gap-8 lg:gap-12 max-w-7xl mx-auto`}>
        {/* Main Content */}
        <div className={hasSidebar ? 'lg:col-span-1' : 'lg:col-span-2'}>
          {news.imageUrl && (
            <Image
              src={news.imageUrl}
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
            <Link href="/news" className="hover:underline">
              <TranslatableText>News</TranslatableText>
            </Link>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-heading leading-tight">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 text-sm text-body/70">
            {news.author && (
              <span>
                {currentLang === 'el' ? 'Από' : 'By'} <span className="font-semibold text-heading">{news.author}</span>
              </span>
            )}
            {news.publishDate && (
              <span>{new Date(news.publishDate.seconds ? news.publishDate.seconds * 1000 : news.publishDate).toLocaleDateString()}</span>
            )}
          </div>
          <div className="prose prose-lg text-body mb-8" dangerouslySetInnerHTML={{ __html: content }} />
          {news.link && (
            <a href={news.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-accent transition">
              {currentLang === 'el' ? 'Διαβάστε Περισσότερα / Εξωτερικός Σύνδεσμος' : 'Read More / External Link'}
            </a>
          )}
        </div>
        {/* Sidebar */}
        {hasSidebar && (
          <aside className="space-y-6 w-full max-w-md mx-auto lg:mx-0 lg:w-auto">
            <h2 className="text-lg font-bold mb-4 text-heading">
              <TranslatableText>Recent News</TranslatableText>
            </h2>
            <div className="space-y-4">
              {recentNews.map((item) => {
                const itemTitle = getLocalizedText(item.title, currentLang);
                return (
                  <Link key={item.id} href={`/news/${item.id}`} className="flex gap-4 rounded-lg bg-card hover:bg-accent/10 transition p-2 group">
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
                        {item.category || (currentLang === 'el' ? 'Νέα' : 'News')}
                      </span>
                      <h3 className="text-md font-bold text-heading mb-1 group-hover:underline line-clamp-2">
                        {itemTitle}
                      </h3>
                      <span className="text-xs text-body/70">
                        {item.publishDate && (new Date(item.publishDate.seconds ? item.publishDate.seconds * 1000 : item.publishDate).toLocaleDateString())}
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