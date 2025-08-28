'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, getLocalizedText } from '@/lib/utils';
import Link from 'next/link';
import { TranslatableText } from '@/components/translatable-content';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation';

interface RecentContentProps {
  search?: string;
  news: any[];
  events: any[];
  loading: boolean;
}

export function RecentContent({ search = '', news, events, loading }: RecentContentProps) {
  const { currentLang } = useTranslation();
  
  const recentNews = news
    .filter(item => {
      const title = getLocalizedText(item.title, currentLang);
      return title.toLowerCase().includes(search.toLowerCase());
    })
    .slice(0, 3);
  const recentEvents = events
    .filter(item => {
      const title = getLocalizedText(item.title, currentLang);
      return title.toLowerCase().includes(search.toLowerCase());
    })
    .slice(0, 3);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg gap-3">
                    <Skeleton className="w-12 h-12 rounded-md" />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-12" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/30 hover:shadow-xl transition-all duration-300">
        <CardHeader className="border-b border-blue-200/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-blue-800">
                <TranslatableText>{{ en: 'Recent News', el: 'Πρόσφατες Ειδήσεις' }}</TranslatableText>
              </CardTitle>
              <CardDescription className="text-blue-600/70">
                <TranslatableText>{{ en: 'Latest news articles', el: 'Τελευταία άρθρα ειδήσεων' }}</TranslatableText>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {recentNews.map((item) => (
              <div key={item.id} className="group flex items-center justify-between p-4 bg-white/70 rounded-xl gap-4 hover:bg-white/90 transition-all duration-200 border border-blue-200/30">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={getLocalizedText(item.title, currentLang)}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded-lg shadow-sm"
                    unoptimized
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-blue-900 truncate group-hover:text-blue-700 transition-colors">
                    {getLocalizedText(item.title, currentLang)}
                  </h4>
                  <p className="text-xs text-blue-600/70">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/news/${item.id}`}>
                    <button className="px-3 py-1 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105">
                      <TranslatableText>{{ en: 'Edit', el: 'Επεξεργασία' }}</TranslatableText>
                    </button>
                  </Link>
                </div>
              </div>
            ))}
            {recentNews.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-blue-600/70 text-sm">
                  <TranslatableText>{{ en: 'No recent news', el: 'Δεν υπάρχουν πρόσφατες ειδήσεις' }}</TranslatableText>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/30 hover:shadow-xl transition-all duration-300">
        <CardHeader className="border-b border-green-200/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-green-800">
                <TranslatableText>{{ en: 'Recent Events', el: 'Πρόσφατες Εκδηλώσεις' }}</TranslatableText>
              </CardTitle>
              <CardDescription className="text-green-600/70">
                <TranslatableText>{{ en: 'Latest events', el: 'Τελευταίες εκδηλώσεις' }}</TranslatableText>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {recentEvents.map((item) => (
              <div key={item.id} className="group flex items-center justify-between p-4 bg-white/70 rounded-xl gap-4 hover:bg-white/90 transition-all duration-200 border border-green-200/30">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={getLocalizedText(item.title, currentLang)}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded-lg shadow-sm"
                    unoptimized
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-green-900 truncate group-hover:text-green-700 transition-colors">
                    {getLocalizedText(item.title, currentLang)}
                  </h4>
                  <p className="text-xs text-green-600/70">
                    {formatDate(item.date)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/events/${item.id}`}>
                    <button className="px-3 py-1 bg-green-500/10 text-green-600 hover:bg-green-500/20 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105">
                      <TranslatableText>{{ en: 'Edit', el: 'Επεξεργασία' }}</TranslatableText>
                    </button>
                  </Link>
                </div>
              </div>
            ))}
            {recentEvents.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-green-600/70 text-sm">
                  <TranslatableText>{{ en: 'No recent events', el: 'Δεν υπάρχουν πρόσφατες εκδηλώσεις' }}</TranslatableText>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}