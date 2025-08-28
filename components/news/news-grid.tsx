'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useContentStore } from '@/lib/store';
import { formatDate, getLocalizedText } from '@/lib/utils';

export function NewsGrid() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { news } = useContentStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const filteredNews = news
    .filter(item => item.published)
    .filter(item => {
      const title = getLocalizedText(item.title);
      const excerpt = getLocalizedText(item.excerpt);
      return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search news articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNews.map((item) => (
          <Card key={item.id} className="bg-soft-orange hover:shadow-lg transition-shadow border-none">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-warm-terracotta text-white">{item.category}</Badge>
                <span className="text-sm text-dark-brown">{formatDate(item.publishDate)}</span>
              </div>
              <CardTitle className="line-clamp-2 text-dark-brown">{getLocalizedText(item.title)}</CardTitle>
              <CardDescription className="line-clamp-3 text-dark-brown">{getLocalizedText(item.excerpt)}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="border-warm-terracotta text-warm-terracotta hover:bg-warm-terracotta hover:text-white" asChild>
                <Link href={`/news/${item.id}`} className="no-underline hover:no-underline focus:no-underline">Read More</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-dark-brown">No news articles found matching your search.</p>
        </div>
      )}
    </div>
  );
}