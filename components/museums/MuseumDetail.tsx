'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Accessibility, ArrowLeft, Calendar } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { TranslatableText } from '@/components/translatable-content';
import { motion, easeOut } from 'framer-motion';
import Image from 'next/image';

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
  createdAt?: any;
}

interface MuseumDetailProps {
  museum: Museum;
  relatedMuseums: Museum[];
}

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
  }
};

const contentVariants = {
  hidden: { 
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeOut,
      delay: 0.2
    }
  }
};

export function MuseumDetail({ museum, relatedMuseums }: MuseumDetailProps) {
  const [mounted, setMounted] = useState(false);
  const { currentLang } = useTranslation() as { currentLang: 'en' | 'el' };

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
    return text[currentLang as 'en' | 'el'] || text.en || '';
  };

  const title = getLocalizedText(museum.title);
  const description = getLocalizedText(museum.description);
  const location = museum.location ? getLocalizedText(museum.location) : '';

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-background"
    >
      {/* Main Content Section */}
      <section className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Back Button */}
            <div className="lg:col-span-3 pt-8 pb-4">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900" asChild>
                <Link href="/museums">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <TranslatableText>Back to Museums</TranslatableText>
                </Link>
              </Button>
            </div>

            {/* Main Content - Left Side (2/3 width) */}
            <div className="lg:col-span-2">
              {/* Image at Top */}
              <div className="relative w-full aspect-video mb-8">
                {museum.imageUrl ? (
                  <Image
                    src={museum.imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                    width={800}
                    height={450}
                    sizes="100vw"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-lg">No image available</span>
                  </div>
                )}
                
                {/* Accessibility Badge */}
                {museum.accessibility && (
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <Accessibility className="h-6 w-6 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Content Below Image */}
              <div className="space-y-6">
                {/* Category Badge */}
                {museum.category && (
                  <Badge className="bg-warm-terracotta text-white">
                    {museum.category}
                  </Badge>
                )}

                {/* Title */}
                <h1 className="text-4xl lg:text-5xl font-bold text-heading leading-tight">
                  {title}
                </h1>

                {/* Location */}
                {location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-5 w-5 text-warm-terracotta" />
                    <span className="text-lg">{location}</span>
                  </div>
                )}

                {/* Description */}
                <div className="text-body/80 text-lg leading-relaxed">
                  {description}
                </div>

                {/* Additional Info */}
                <div className="space-y-4">
                  {museum.accessibility && (
                    <div className="flex items-center gap-3 text-green-600">
                      <Accessibility className="h-5 w-5" />
                      <span className="font-medium">
                        <TranslatableText>Accessibility Available</TranslatableText>
                      </span>
                    </div>
                  )}
                  
                  {museum.createdAt && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="h-5 w-5" />
                      <span>
                        <TranslatableText>Added on</TranslatableText> {new Date(museum.createdAt?.seconds ? museum.createdAt.seconds * 1000 : museum.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 pb-6">
                  <Button 
                    className="bg-primary hover:bg-blue-600 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out" 
                    asChild
                  >
                    <Link href="/museums">
                      <TranslatableText>View All Museums</TranslatableText>
                    </Link>
                  </Button>
                  
                  {location && (
                    <Button 
                      variant="outline" 
                      className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ease-in-out"
                    >
                      <MapPin className="h-5 w-3 mr-2" />
                      <TranslatableText>Get Directions</TranslatableText>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Other Places - Right Side (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 pt-8">
                <h2 className="text-2xl font-bold text-heading mb-6">
                  <TranslatableText>Other Places</TranslatableText>
                </h2>
                {relatedMuseums.length > 0 ? (
                  <div className="space-y-4">
                    {relatedMuseums.map((relatedMuseum, index) => (
                      <motion.div
                        key={relatedMuseum.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-white hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-200">
                          {relatedMuseum.imageUrl && (
                            <div className="aspect-video overflow-hidden">
                              <Image
                                src={relatedMuseum.imageUrl}
                                alt={getLocalizedText(relatedMuseum.title)}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                width={600}
                                height={338}
                                sizes="(max-width: 768px) 100vw, 33vw"
                                unoptimized
                              />
                            </div>
                          )}
                          <CardContent className="p-4">
                            <h3 className="text-lg font-bold text-heading mb-2 line-clamp-2">
                              {getLocalizedText(relatedMuseum.title)}
                            </h3>
                            <p className="text-body/70 text-sm line-clamp-2 mb-3">
                              {getLocalizedText(relatedMuseum.description)}
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white w-full transition-all duration-300 ease-in-out" 
                              asChild
                            >
                              <Link href={`/museums/${relatedMuseum.id}`}>
                                <TranslatableText>Learn More</TranslatableText>
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <TranslatableText>No other places available</TranslatableText>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>


    </motion.div>
  );
} 