'use client';

import { useState, useEffect } from 'react';

interface AppearanceSettings {
  heroImages: {
    image1: string;
    image2: string;
  };
  exploreTownImage: string;
}

const defaultSettings: AppearanceSettings = {
  heroImages: {
    image1: '/h1.jpeg',
    image2: '/h2.jpeg',
  },
  exploreTownImage: '/hero2.jpeg',
};

export function useAppearanceSettings() {
  const [settings, setSettings] = useState<AppearanceSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('appearanceSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error parsing appearance settings:', error);
        setSettings(defaultSettings);
      }
    }
    setLoading(false);
  }, []);

  const updateSettings = (newSettings: Partial<AppearanceSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('appearanceSettings', JSON.stringify(updatedSettings));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('appearanceSettings');
  };

  return {
    settings,
    loading,
    updateSettings,
    resetSettings,
  };
} 