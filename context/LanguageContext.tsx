'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  lang: 'en' | 'el';
  setLang: (lang: 'en' | 'el') => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'el', // Changed default to Greek
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<'en' | 'el'>('el'); // Changed default to Greek
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
} 