'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { translateText } from '@/lib/translate';

// Create a context for translation state
const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  const [currentLang, setCurrentLangState] = useState('el'); // Default to Greek
  const [isClient, setIsClient] = useState(false);

  // Handle SSR - only run on client
  useEffect(() => {
    setIsClient(true);
    
    // Load language from localStorage on mount
    try {
      const savedLang = localStorage.getItem('currentLang');
      if (savedLang) {
        setCurrentLangState(savedLang);
      } else {
        // If no saved language, default to Greek and save it
        localStorage.setItem('currentLang', 'el');
      }
    } catch (error) {
      // Fallback to default language
      setCurrentLangState('el');
    }
  }, []);

  const setCurrentLang = (lang) => {
    setCurrentLangState(lang);
    try {
      localStorage.setItem('currentLang', lang);
    } catch (error) {
      // Silently handle localStorage errors
    }
  };

  const translate = (text, targetLang) => {
    if (!text || targetLang === 'en') {
      return text;
    }
    
    const translated = translateText(text, 'en', targetLang);
    return translated;
  };

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return (
      <TranslationContext.Provider value={{
        currentLang: 'el', // Default value for SSR
        setCurrentLang: () => {}, // No-op for SSR
        translate: (text) => text, // Return text as-is for SSR
        isTranslating: false
      }}>
        {children}
      </TranslationContext.Provider>
    );
  }

  return (
    <TranslationContext.Provider value={{
      currentLang,
      setCurrentLang,
      translate,
      isTranslating: false
    }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
} 