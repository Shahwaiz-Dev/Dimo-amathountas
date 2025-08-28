'use client';

import { useState, useEffect } from 'react';

interface AppearanceSettings {
  heroImages: {
    image1: string;
    image2: string;
  };
  exploreTownImage: string;
  eventsSectionImage: string;
  museumsSectionImage: string;
  mainNavigationOrder: string[];
}

const defaultSettings: AppearanceSettings = {
  heroImages: {
    image1: '/h1.jpeg',
    image2: '/h2.jpeg',
  },
  exploreTownImage: '/hero2.jpeg',
  eventsSectionImage: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80',
  museumsSectionImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  mainNavigationOrder: ['home', 'news', 'events', 'contact', 'museums'],
};

export function useAppearanceSettings() {
  const [settings, setSettings] = useState<AppearanceSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const { getAppearanceSettingsFromFirestore } = await import('@/lib/firestore');
        const firestoreSettings = await getAppearanceSettingsFromFirestore();
        
        if (firestoreSettings) {
          setSettings({ ...defaultSettings, ...firestoreSettings });
        } else {
          // Fallback to localStorage if no Firestore settings
          const savedSettings = localStorage.getItem('appearanceSettings');
          if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            setSettings({ ...defaultSettings, ...parsed });
          }
        }
      } catch (error) {
        console.error('Error loading appearance settings:', error);
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    }
    
    loadSettings();
  }, []);

  return { settings, loading };
} 