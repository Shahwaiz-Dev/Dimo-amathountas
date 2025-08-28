'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TranslatableText } from '@/components/translatable-content';
import Image from 'next/image';
import { 
  optimizedAnimations, 
  animationVariants, 
  gpuAccelerationClasses,
  animationPerformance 
} from '@/lib/animation-utils';
import { getHeroImages, getHeroImagesSync } from '@/lib/appearance-utils';

// Default hero data structure
const getDefaultHeroes = () => [
  {
    image: '/hero2.jpeg',
    alt: 'Agios Athanasios',
    bg: '#fff',
    heading: { en: "There's Never A Dull Moment In Our Town", el: "Ποτέ δεν βαριέσαι στην πόλη μας" },
    text: {
      en: 'From unforgettable musical performances to breathtaking art exhibitions. There is always something going on.',
      el: 'Από αξέχαστες μουσικές παραστάσεις μέχρι συναρπαστικές εκθέσεις τέχνης. Πάντα κάτι συμβαίνει.'
    },
    button: { href: '/events', label: { en: 'Check Out Upcoming Events', el: 'Δείτε τις επερχόμενες εκδηλώσεις' } },
    buttonClass: 'bg-primary text-white',
    textClass: 'text-heading',
  },
  {
    image: '/hero2.jpeg',
    alt: 'Agios Athanasios Municipality',
    bg: '#fff',
    heading: { en: 'Hello! Welcome to the website of Agios Athanasios Municipality', el: 'Καλώς ήρθατε στην ιστοσελίδα του Δήμου Αγίου Αθανασίου' },
    text: {
      en: 'This website will allow you to learn more about the beautiful village of Agios Athanasios.',
      el: 'Αυτή η ιστοσελίδα θα σας επιτρέψει να μάθετε περισσότερα για το όμορφο χωριό του Αγίου Αθανασίου.'
    },
    button: { href: '/news', label: { en: "See What's New", el: 'Δείτε τα νέα' } },
    buttonClass: 'bg-primary text-white',
    textClass: 'text-heading',
  },
];

export function Hero() {
  const { lang } = useLanguage();
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [heroes, setHeroes] = useState(getDefaultHeroes());

  // Load appearance settings
  useEffect(() => {
    async function loadHeroImages() {
      try {
        // First try to get from Firestore
        const { getAppearanceSettingsFromFirestore } = await import('@/lib/firestore');
        const firestoreSettings = await getAppearanceSettingsFromFirestore();
        
        let heroImages: { image1: string; image2: string };
        if (firestoreSettings && firestoreSettings.heroImages) {
          heroImages = firestoreSettings.heroImages;
        } else {
          // Fallback to sync method which uses localStorage
          heroImages = getHeroImagesSync();
        }
        
        const defaultHeroes = getDefaultHeroes();
        
        // Update hero images with saved settings
        const updatedHeroes = defaultHeroes.map((hero, index) => {
          const newImage = index === 0 ? heroImages.image1 : heroImages.image2;
          
          // Use dynamic image if available, otherwise use empty string to indicate no image
          return {
            ...hero,
            image: newImage || ''
          };
        }).filter(hero => hero.image); // Filter out slides without images
        
        // Only update if we have at least one hero with an image
        if (updatedHeroes.length > 0) {
          setHeroes(updatedHeroes);
          // Reset index if current index is out of bounds
          if (idx >= updatedHeroes.length) {
            setIdx(0);
          }
        }
      } catch (error) {
        console.error('Error loading hero images:', error);
        // Keep the current heroes if there's an error
      }
    }
    
    loadHeroImages();
  }, []);

  const hero = heroes[idx];

  // Don't render anything if no heroes are available
  if (!hero || heroes.length === 0) {
    return null;
  }

  const switchHero = (newIdx: number, dir: number) => {
    setDirection(dir);
    setIdx(newIdx);
  };

  // Auto-advance hero every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      switchHero((idx + 1) % heroes.length, 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [idx, heroes.length]);

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      switchHero((idx + 1) % heroes.length, 1);
    } else if (isRightSwipe) {
      switchHero((idx - 1 + heroes.length) % heroes.length, -1);
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <section className="w-full min-h-[400px] md:min-h-[600px] flex flex-col md:flex-row overflow-hidden relative">
      {/* Left: Image */}
      <div 
        className="md:w-1/2 w-full h-[240px] md:h-auto flex-shrink-0 min-h-[400px] md:min-h-[600px] relative" 
        style={{ backgroundColor: hero.bg }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={hero.image}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1, 
              transition: { 
                ...optimizedAnimations.smooth,
                ...animationPerformance.getReducedMotionConfig()
              } 
            }}
            exit={{ 
              opacity: 0, 
              transition: { 
                ...optimizedAnimations.smooth,
                ...animationPerformance.getReducedMotionConfig()
              } 
            }}
            className={`w-full h-full object-cover absolute inset-0 ${gpuAccelerationClasses.gpu}`}
            style={{ zIndex: 1 }}
          >
            <Image
              src={hero.image}
              alt={hero.alt}
              fill
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Mobile Navigation Overlay */}
        <div className="md:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-4">
          {/* Previous Button */}
          <button
            aria-label="Previous hero"
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
            onClick={() => switchHero((idx - 1 + heroes.length) % heroes.length, -1)}
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          {/* Dots */}
          <div className="flex gap-2">
            {heroes.map((_, i) => (
              <button
                key={i}
                onClick={() => switchHero(i, i > idx ? 1 : -1)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === idx 
                    ? 'bg-white shadow-lg scale-110' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          
          {/* Next Button */}
          <button
            aria-label="Next hero"
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
            onClick={() => switchHero((idx + 1) % heroes.length, 1)}
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
      
      {/* Middle: Desktop Carousel Dots + Arrows */}
      <div
        className="hidden md:flex flex-col items-center justify-center px-2 transition-colors duration-500"
        style={{ backgroundColor: hero.bg }}
      >
        <button
          aria-label="Previous hero"
          className="mb-2 p-1 rounded hover:bg-gray-200 transition-colors"
          onClick={() => switchHero((idx - 1 + heroes.length) % heroes.length, -1)}
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <div className="flex flex-col gap-3">
          {heroes.map((_, i) => (
            <button
              key={i}
              onClick={() => switchHero(i, i > idx ? 1 : -1)}
              className={`w-3 h-3 rounded-full block transition-all duration-300 ${
                i === idx ? 'bg-gray-400 scale-110' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          aria-label="Next hero"
          className="mt-2 p-1 rounded hover:bg-gray-200 transition-colors"
          onClick={() => switchHero((idx + 1) % heroes.length, 1)}
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      
      {/* Right: Text Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={hero.bg + idx}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1, 
            transition: { 
              ...optimizedAnimations.smooth,
              ...animationPerformance.getReducedMotionConfig()
            } 
          }}
          exit={{ 
            opacity: 0, 
            transition: { 
              ...optimizedAnimations.smooth,
              ...animationPerformance.getReducedMotionConfig()
            } 
          }}
          className={`flex-1 flex flex-col justify-center items-start px-6 py-12 min-h-[400px] md:min-h-[600px] w-full relative ${gpuAccelerationClasses.gpu}`}
          style={{ zIndex: 2, backgroundColor: hero.bg }}
        >
          <motion.h1
            className={`text-4xl md:text-5xl font-extrabold mb-6 ${hero.textClass}`}
            variants={animationVariants.fadeInDown}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{
              ...optimizedAnimations.standard,
              ...animationPerformance.getReducedMotionConfig()
            }}
          >
            <TranslatableText>{hero.heading}</TranslatableText>
          </motion.h1>
          <motion.p
            className={`text-lg mb-8 max-w-lg ${hero.textClass}`}
            variants={animationVariants.fadeInDown}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{
              ...optimizedAnimations.standard,
              delay: 0.1,
              ...animationPerformance.getReducedMotionConfig()
            }}
          >
            <TranslatableText>{hero.text}</TranslatableText>
          </motion.p>

          <motion.div
            variants={animationVariants.fadeInDown}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{
              ...optimizedAnimations.standard,
              delay: 0.2,
              ...animationPerformance.getReducedMotionConfig()
            }}
          >
            <Button asChild className={`${hero.buttonClass} font-semibold px-8 py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white`}>
              <Link href={hero.button.href}>
                <TranslatableText>{hero.button.label}</TranslatableText>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}