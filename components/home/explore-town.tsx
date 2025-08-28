'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { TranslatableText } from '@/components/translatable-content';
import { useState, useEffect } from 'react';
import { getExploreTownImage, getExploreTownImageSync } from '@/lib/appearance-utils';

export function ExploreTown() {
  const [imageSrc, setImageSrc] = useState('/hero2.jpeg');

  // Load appearance settings
  useEffect(() => {
    async function loadExploreTownImage() {
      try {
        // First try to get from Firestore
        const { getAppearanceSettingsFromFirestore } = await import('@/lib/firestore');
        const firestoreSettings = await getAppearanceSettingsFromFirestore();
        
        if (firestoreSettings && firestoreSettings.exploreTownImage) {
          setImageSrc(firestoreSettings.exploreTownImage);
        } else if (firestoreSettings && firestoreSettings.exploreTownImage === '') {
          // Image was explicitly removed
          setImageSrc('');
        } else {
          // Fallback to sync method which uses localStorage
          const exploreTownImage = getExploreTownImageSync();
          if (exploreTownImage && exploreTownImage !== '/hero2.jpeg') {
            setImageSrc(exploreTownImage);
          } else if (exploreTownImage === '') {
            setImageSrc('');
          }
        }
      } catch (error) {
        console.error('Error loading explore town image:', error);
        // Don't change the image if there's an error, keep what was set initially
      }
    }
    
    loadExploreTownImage();
  }, []);

  return (
    <section className="w-full flex flex-col md:flex-row min-h-[540px] md:min-h-[640px] bg-primary text-white animate-fade-in-up overflow-hidden">
      {/* Left: Content */}
      <div className={`w-full ${imageSrc ? 'md:w-1/2' : ''} flex flex-col justify-center px-8 py-20 md:py-0 md:pl-24`}>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          <TranslatableText>Explore Our Charming Little Town</TranslatableText>
        </h2>
        <p className="text-lg mb-8 max-w-lg">
          <TranslatableText>Display a directory of businesses in your municipality with important contact details and opening hours.</TranslatableText>
        </p>
        <Button asChild className="bg-white text-primary font-semibold px-8 py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white w-fit">
          <Link href="/town-map">
            <TranslatableText>Open Town Map</TranslatableText>
          </Link>
        </Button>
      </div>
      {/* Right: Image - Only show if image exists */}
      {imageSrc && (
        <div className="w-full md:w-1/2 relative min-h-[340px] md:min-h-0 flex items-stretch">
          <Image
            src={imageSrc}
            alt="Explore Town"
            fill
            className="object-cover object-center w-full h-full"
            style={{ minHeight: '100%', maxHeight: '100%' }}
            priority
          />
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        </div>
      )}
    </section>
  );
}