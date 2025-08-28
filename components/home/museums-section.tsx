'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchMuseums } from '@/lib/firestore';
import { useTranslation } from '@/hooks/useTranslation';
import { TranslatableText } from '@/components/translatable-content';
import { Accessibility, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  optimizedAnimations, 
  animationVariants, 
  gpuAccelerationClasses,
  animationPerformance 
} from '@/lib/animation-utils';
import { getMuseumsSectionImage, getMuseumsSectionImageSync } from '@/lib/appearance-utils';

export function MuseumsSection() {
  const [museums, setMuseums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentLang } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    async function loadMuseumsSectionImage() {
      try {
        // First try to get from Firestore
        const { getAppearanceSettingsFromFirestore } = await import('@/lib/firestore');
        const firestoreSettings = await getAppearanceSettingsFromFirestore();
        
        if (firestoreSettings) {
          setBackgroundImage(firestoreSettings.museumsSectionImage || '');
        } else {
          // Fallback to sync method which uses localStorage
          const museumsSectionImage = getMuseumsSectionImageSync();
          setBackgroundImage(museumsSectionImage || '');
        }
      } catch (error) {
        console.error('Error loading museums section image:', error);
        // No fallback - let the section work without background image
        setBackgroundImage('');
      }
    }
    
    loadMuseumsSectionImage();
  }, []);

  useEffect(() => {
    async function loadMuseums() {
      setLoading(true);
      const data: any[] = await fetchMuseums();
      const normalized = data.map(museum => ({
        ...museum,
        createdAt: museum.createdAt?.seconds
          ? new Date(museum.createdAt.seconds * 1000).toISOString()
          : museum.createdAt,
        updatedAt: museum.updatedAt?.seconds
          ? new Date(museum.updatedAt.seconds * 1000).toISOString()
          : museum.updatedAt,
        publishDate: museum.publishDate
          ? (museum.publishDate.seconds
              ? museum.publishDate.seconds * 1000
              : new Date(museum.publishDate).getTime())
          : 0,
      }));
      setMuseums(normalized);
      setLoading(false);
    }
    loadMuseums();
  }, [currentLang]);

  const getLocalizedText = (text: string | { en: string; el: string }): string => {
    if (typeof text === 'string') {
      return text;
    }
    if (typeof text === 'object' && text !== null && 'en' in text && 'el' in text) {
      return text[currentLang as keyof typeof text] || text.en || '';
    }
    return '';
  };

  const now = Date.now();
  const featuredMuseums = museums.filter(item => {
    if (!item.featured) return false;
    if (!item.published) return false;
    let publishDate = null;
    if (item.publishDate?.seconds) publishDate = item.publishDate.seconds * 1000;
    else if (typeof item.publishDate === 'number') publishDate = item.publishDate;
    else if (typeof item.publishDate === 'string') publishDate = new Date(item.publishDate).getTime();
    if (!publishDate) return true;
    return publishDate <= now;
  });
  const needsSlider = featuredMuseums.length > 3;
  const slides = needsSlider ? Math.ceil(featuredMuseums.length / 3) : 1;
  const getCurrentSlideMuseums = () => {
    if (!needsSlider) return featuredMuseums;
    const startIndex = currentSlide * 3;
    return featuredMuseums.slice(startIndex, startIndex + 3);
  };
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides) % slides);
  useEffect(() => {
    if (!needsSlider) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [needsSlider, currentSlide, slides]);

  return (
    <section className="py-16 relative overflow-hidden min-h-[600px]" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)' }}>
      {/* Background image - only show if available */}
      <div className="absolute inset-0 z-0">
        {backgroundImage && (
          <img
            src={backgroundImage}
            alt="Background"
            className="w-full h-full object-cover object-center opacity-60"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-700/60 to-white/0" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-left mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
            <TranslatableText>{{ en: "Museums and Places", el: "Μουσεία και Χώροι" }}</TranslatableText>
          </h2>
          <p className="text-lg text-blue-100 max-w-3xl mb-4">
            <TranslatableText>{{ en: "Open, fully accessible cultural centers", el: "Ανοιχτά, πλήρως προσβάσιμα πολιτιστικά κέντρα" }}</TranslatableText>
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-primary text-lg">
              <TranslatableText>{{ en: "Loading...", el: "Φόρτωση..." }}</TranslatableText>
            </p>
          </div>
        ) : featuredMuseums.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-primary text-lg">
              <TranslatableText>{{ en: "No museums available at the moment.", el: "Δεν υπάρχουν διαθέσιμα μουσεία αυτή τη στιγμή." }}</TranslatableText>
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
                transition={{ 
                  ...optimizedAnimations.smooth,
                  ...animationPerformance.getReducedMotionConfig()
                }}
                className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 ${gpuAccelerationClasses.gpu}`}
              >
                {getCurrentSlideMuseums().map((museum, idx) => (
                  <div
                    key={museum.id}
                    className="relative shadow-xl group transition-all duration-200 bg-white hover:shadow-2xl border border-gray-200"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {museum.imageUrl && (
                      <div className="aspect-video">
                        <Image
                          src={museum.imageUrl}
                          alt={getLocalizedText(museum.title)}
                          className="w-full h-full object-cover transition-transform duration-200"
                          width={600}
                          height={338}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-heading mb-2 line-clamp-2">
                            {getLocalizedText(museum.title)}
                          </h3>
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
                        <Badge className="bg-warm-terracotta text-white mb-3">
                          {museum.category}
                        </Badge>
                      )}
                      
                      <p className="text-body/70 line-clamp-3 mb-4">
                        {getLocalizedText(museum.description)}
                      </p>
                      
                      {museum.location && (
                        <div className="flex items-center gap-2 text-sm text-body/60 mb-4">
                          <MapPin className="h-4 w-4 text-warm-terracotta" />
                          <span>{getLocalizedText(museum.location)}</span>
                        </div>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white w-full transition-all duration-200 ease-in-out" 
                        asChild
                      >
                        <Link href={`/museums/${museum.id}`}>
                          <TranslatableText>{{ en: "Learn More", el: "Μάθετε περισσότερα" }}</TranslatableText>
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
            <div className="flex flex-col items-center gap-y-4 mt-6">
              {needsSlider && (
                <div className="flex justify-center items-center gap-4">
                  <button
                    onClick={prevSlide}
                    className="bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 border border-gray-200"
                    aria-label="Previous museums"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-3">
                    {Array.from({ length: slides }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`w-4 h-4 rounded-full transition-all duration-200 border-2 ${
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
                    className="bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 border border-gray-200"
                    aria-label="Next museums"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        
        <div className="text-center mt-8">
          <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out" asChild>
            <Link href="/museums">
              <TranslatableText>{{ en: "View All Museums", el: "Δείτε όλα τα μουσεία" }}</TranslatableText>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}