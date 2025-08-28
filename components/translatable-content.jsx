'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

// Helper function to get localized text from multilingual objects
const getLocalizedText = (text, lang) => {
  if (typeof text === 'string') {
    return text;
  }
  if (text && typeof text === 'object' && (text.en || text.el)) {
    return text[lang] || text.en || '';
  }
  return '';
};

// Simple text translation component for navigation links and simple text
export function TranslatableText({ children, className = "" }) {
  const { currentLang, translate, isTranslating } = useTranslation();
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const translateText = async () => {
      try {
        // Handle multilingual objects
        if (children && typeof children === 'object' && (children.en || children.el)) {
          const localizedText = getLocalizedText(children, currentLang);
          setTranslatedText(localizedText || '');
          return;
        }

        // Handle regular strings
        if (typeof children === 'string') {
          if (currentLang === 'en') {
            setTranslatedText(children);
            return;
          }

          setIsLoading(true);
          try {
            const translated = await translate(children, currentLang);
            setTranslatedText(translated || children || '');
          } catch (error) {
            setTranslatedText(children || '');
          } finally {
            setIsLoading(false);
          }
        } else {
          // Handle null, undefined, or other non-string values
          setTranslatedText('');
        }
      } catch (error) {
        setTranslatedText('');
      }
    };

    translateText();
  }, [currentLang, children, translate]);

  // Ensure we always render a string, never an object
  const displayText = isLoading ? '...' : (translatedText || '');

  // Additional safety check - ensure we never render an object
  if (typeof displayText === 'object') {
    return <span className={className}>Error</span>;
  }

  return (
    <span className={className}>
      {displayText}
    </span>
  );
}

export function TranslatableContent({ title, content, className = "" }) {
  const { currentLang, translate, isTranslating } = useTranslation();
  // Helper to get localized string if object, or just use string
  const getLocalized = (val) => {
    if (typeof val === 'string') return val;
    if (val && typeof val === 'object' && (val.en || val.el)) {
      return val[currentLang] || val.en || '';
    }
    return '';
  };
  const [translatedTitle, setTranslatedTitle] = useState(getLocalized(title));
  const [translatedContent, setTranslatedContent] = useState(getLocalized(content));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const translateContent = async () => {
      // If title/content are objects, use the localized string directly
      const localizedTitle = getLocalized(title);
      const localizedContent = getLocalized(content);
      if (currentLang === 'en' || (typeof title === 'object' && title.en && title.el) || (typeof content === 'object' && content.en && content.el)) {
        setTranslatedTitle(localizedTitle);
        setTranslatedContent(localizedContent);
        return;
      }
      setIsLoading(true);
      try {
        const [newTitle, newContent] = await Promise.all([
          translate(localizedTitle, currentLang),
          translate(localizedContent, currentLang)
        ]);
        setTranslatedTitle(newTitle);
        setTranslatedContent(newContent);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedTitle(localizedTitle);
        setTranslatedContent(localizedContent);
      } finally {
        setIsLoading(false);
      }
    };

    translateContent();
  }, [currentLang, title, content, translate]);

  return (
    <div className={className}>
      <h2 className="text-xl font-bold mb-2">
        {isLoading ? 'Translating...' : translatedTitle}
      </h2>
      <p className="text-gray-700">
        {isLoading ? 'Translating content...' : translatedContent}
      </p>
    </div>
  );
}

export function TranslatableNewsItem({ news }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <TranslatableContent 
        title={news.title} 
        content={news.content}
        className="mb-4"
      />
      <div className="text-sm text-gray-500">
        <span>Date: {news.date}</span>
        {news.author && <span className="ml-4">Author: {news.author}</span>}
      </div>
    </div>
  );
}

export function TranslatableEventItem({ event }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <TranslatableContent 
        title={event.title} 
        content={event.description}
        className="mb-4"
      />
      <div className="text-sm text-gray-500">
        <span>Date: {event.date}</span>
        <span className="ml-4">Time: {event.time}</span>
        {event.location && <span className="ml-4">Location: {event.location}</span>}
      </div>
    </div>
  );
} 