'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Cookie, Settings } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { TranslatableText } from '@/components/translatable-content';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { currentLang } = useTranslation();

  useEffect(() => {
    setIsClient(true);
    
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsent', 'all');
    }
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsent', 'essential');
    }
    setIsVisible(false);
  };

  const handleDecline = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsent', 'declined');
    }
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  // Don't render anything during SSR or if not client-side
  if (!isClient || !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{ 
            duration: 0.3, 
            ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for smooth 60fps feel
            opacity: { duration: 0.2 },
            scale: { duration: 0.25 }
          }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
          style={{ 
            willChange: 'transform, opacity', // Optimize for GPU acceleration
            transform: 'translateZ(0)' // Force hardware acceleration
          }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="bg-white/95 backdrop-blur-lg border border-gray-200/50 rounded-2xl shadow-2xl p-4"
              initial={{ scale: 0.98, opacity: 0.9 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.2, 
                delay: 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              style={{ 
                willChange: 'transform, opacity',
                transform: 'translateZ(0)'
              }}
            >
              {/* Header - Full Width */}
              <div className="flex items-center justify-between mb-4 w-full">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900">
                      <TranslatableText>
                        {currentLang === 'el' ? 'Χρήση Cookies' : 'Cookie Usage'}
                      </TranslatableText>
                    </h3>
                    <p className="text-sm text-gray-600">
                      <TranslatableText>
                        {currentLang === 'el' 
                          ? 'Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία σας.'
                          : 'We use cookies to enhance your experience on our website.'
                        }
                      </TranslatableText>
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-4"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Cookie Types - Spread Across Width */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2 bg-blue-50/50 rounded-lg px-3 py-2 border border-blue-100 flex-1">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Shield className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-blue-900">
                    <TranslatableText>
                      {currentLang === 'el' ? 'Απαραίτητα' : 'Essential'}
                    </TranslatableText>
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-green-50/50 rounded-lg px-3 py-2 border border-green-100 flex-1">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Cookie className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-900">
                    <TranslatableText>
                      {currentLang === 'el' ? 'Ανάλυση' : 'Analytics'}
                    </TranslatableText>
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-purple-50/50 rounded-lg px-3 py-2 border border-purple-100 flex-1">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <Settings className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-purple-900">
                    <TranslatableText>
                      {currentLang === 'el' ? 'Προσωροποίηση' : 'Personalization'}
                    </TranslatableText>
                  </span>
                </div>
              </div>

              {/* Action Buttons - Spread Across Width */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <Button
                  onClick={handleAcceptAll}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 hover:shadow-lg text-sm flex-1"
                >
                  <TranslatableText>
                    {currentLang === 'el' ? 'Αποδοχή Όλων' : 'Accept All'}
                  </TranslatableText>
                </Button>
                
                <Button
                  onClick={handleAcceptEssential}
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 font-medium py-2 px-6 rounded-lg transition-all duration-200 text-sm flex-1"
                >
                  <TranslatableText>
                    {currentLang === 'el' ? 'Απαραίτητα' : 'Essential'}
                  </TranslatableText>
                </Button>
                
                <Button
                  onClick={handleDecline}
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-700 font-medium py-2 px-6 rounded-lg transition-all duration-200 text-sm flex-1"
                >
                  <TranslatableText>
                    {currentLang === 'el' ? 'Απόρριψη' : 'Decline'}
                  </TranslatableText>
                </Button>
              </div>

              {/* Privacy Policy Link - Full Width */}
              <div className="flex items-center justify-center">
                <p className="text-sm text-gray-500">
                  <TranslatableText>
                    {currentLang === 'el' 
                      ? 'Μάθετε περισσότερα στην '
                      : 'Learn more in our '
                    }
                  </TranslatableText>
                  <a 
                    href="/privacy-policy" 
                    className="text-blue-600 hover:text-blue-700 underline font-medium"
                  >
                    <TranslatableText>
                      {currentLang === 'el' ? 'Πολιτική Απορρήτου' : 'Privacy Policy'}
                    </TranslatableText>
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 