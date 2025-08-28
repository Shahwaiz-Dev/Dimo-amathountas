'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { MapPin, Search, Accessibility } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { TranslatableText } from '@/components/translatable-content';

interface Museum {
  id: string;
  title: string | { en: string; el: string };
  description: string | { en: string; el: string };
  imageUrl?: string;
  location?: string | { en: string; el: string };
  category?: string;
  accessibility?: boolean;
  published?: boolean;
  featured?: boolean;
  publishDate?: { seconds: number } | number | string;
}

export function MuseumsList({ museums }: { museums: Museum[] }) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accessible, setAccessible] = useState(false);
  const [featured, setFeatured] = useState(false);
  const { currentLang } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const getLocalizedText = (text: string | { en: string; el: string }): string => {
    if (typeof text === 'string') {
      return text;
    }
    return text[currentLang as keyof typeof text] || text.en || '';
  };

  const filteredMuseums = museums
    .filter(item => {
      if (!item.published) return false;
      if (typeof item.publishDate === 'undefined') return true;
      // If publishDate is a number (ms)
      if (typeof item.publishDate === 'number') return item.publishDate <= Date.now();
      // If publishDate is a Firestore Timestamp
      if (item.publishDate && typeof item.publishDate === 'object' && 'seconds' in item.publishDate)
        return item.publishDate.seconds * 1000 <= Date.now();
      // If publishDate is a string (ISO date)
      if (typeof item.publishDate === 'string') return new Date(item.publishDate).getTime() <= Date.now();
      // Fallback: don't show
      return false;
    })
    .filter(item => {
      const title = getLocalizedText(item.title);
      const description = getLocalizedText(item.description);
      const location = item.location ? getLocalizedText(item.location) : '';
      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAccessible = accessible ? item.accessibility : true;
      const matchesFeatured = featured ? item.featured : true;
      return matchesSearch && matchesAccessible && matchesFeatured;
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Modern Filter Bar */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl shadow mb-6">
        <Input
          placeholder={currentLang === 'el' ? 'Αναζήτηση μουσείων και χώρων...' : 'Search museums and places...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-48"
        />
        <div className="flex items-center gap-2">
          <Switch checked={accessible} onCheckedChange={setAccessible} />
          <span><TranslatableText>Accessible</TranslatableText></span>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={featured} onCheckedChange={setFeatured} />
          <span><TranslatableText>Featured</TranslatableText></span>
        </div>
      </div>
      {/* End Filter Bar */}
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredMuseums.map((museum, index) => (
          <motion.div
            key={museum.id}
            variants={itemVariants}
            custom={index}
          >
            <Card className="bg-white hover:shadow-lg transition-all duration-300 border border-gray-200 group">
              {museum.imageUrl && (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <Image
                    src={museum.imageUrl}
                    alt={getLocalizedText(museum.title)}
                    className="max-w-full max-h-full object-contain transition-transform duration-300"
                    width={600}
                    height={338}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-2 text-dark-brown text-lg">
                      {getLocalizedText(museum.title)}
                    </CardTitle>
                  </div>
                  {museum.accessibility && (
                    <div className="flex-shrink-0 ml-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Accessibility className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                {museum.category && (
                  <Badge className="bg-warm-terracotta text-white mb-2">
                    {museum.category}
                  </Badge>
                )}
                <CardDescription className="line-clamp-3 text-dark-brown">
                  {getLocalizedText(museum.description)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {museum.location && (
                  <div className="flex items-center gap-2 text-sm text-dark-brown mb-4">
                    <MapPin className="h-4 w-4 text-warm-terracotta" />
                    <span>{getLocalizedText(museum.location)}</span>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white w-full" 
                  asChild
                >
                  <Link href={`/museums/${museum.id}`}>
                    <TranslatableText>Learn More</TranslatableText>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {filteredMuseums.length === 0 && (
        <div className="text-center py-12">
          <p className="text-dark-brown text-lg">
            {searchQuery ? (
              currentLang === 'el' ? 'Δεν βρέθηκαν μουσεία που να ταιριάζουν με την αναζήτησή σας.' : 'No museums found matching your search.'
            ) : (
              currentLang === 'el' ? 'Δεν υπάρχουν διαθέσιμα μουσεία αυτή τη στιγμή.' : 'No museums available at the moment.'
            )}
          </p>
        </div>
      )}
    </div>
  );
} 