import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Robust helper function to get localized text from multilingual objects
export function getLocalizedText(text: string | { en: string; el: string } | undefined | null, currentLang: string = 'en'): string {
  if (!text) return '';
  if (typeof text === 'string') {
    return text;
  }
  if (text && typeof text === 'object' && (text.en || text.el)) {
    return text[currentLang as keyof typeof text] || text.en || text.el || '';
  }
  return '';
}

// Safe string conversion for React rendering
export function safeString(value: any): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value.toString();
  if (typeof value === 'object') {
    // Handle multilingual objects
    if (value.en || value.el) {
      return value.en || value.el || '';
    }
    // For other objects, return empty string to avoid React errors
    return '';
  }
  return '';
}

export function formatDate(dateInput: any): string {
  let date: Date;

  if (!dateInput) return '';

  // Firestore Timestamp object
  if (typeof dateInput === 'object' && dateInput.seconds) {
    date = new Date(dateInput.seconds * 1000);
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}