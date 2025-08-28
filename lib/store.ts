'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NewsItem {
  id: string;
  title: { en: string; el: string };
  excerpt: { en: string; el: string };
  content: { en: string; el: string };
  category: string;
  published: boolean;
  featured: boolean;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  link?: string;
}

interface EventItem {
  id: string;
  title: { en: string; el: string };
  description: { en: string; el: string };
  date: string;
  time: string;
  location: string;
  category: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  link?: string;
}

interface ContentStore {
  news: NewsItem[];
  events: EventItem[];
  addNews: (news: NewsItem) => void;
  updateNews: (id: string, updates: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
  addEvent: (event: EventItem) => void;
  updateEvent: (id: string, updates: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
}

const initialNews: NewsItem[] = [
  {
    id: '1',
    title: { en: 'Welcome to Our New CMS Platform', el: 'Καλώς ήρθατε στη νέα μας πλατφόρμα CMS' },
    excerpt: { en: 'We are excited to introduce our new content management system with modern features and intuitive design.', el: 'Είμαστε ενθουσιασμένοι που παρουσιάζουμε το νέο μας σύστημα διαχείρισης περιεχομένου με σύγχρονες δυνατότητες και μοντέρνο σχεδιασμό.' },
    content: { en: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', el: 'Αυτό είναι ένα παράδειγμα περιεχομένου στα Ελληνικά. Μπορείτε να προσθέσετε το δικό σας περιεχόμενο εδώ.' },
    category: 'announcement',
    published: true,
    featured: true,
    publishDate: '2024-01-15',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: '2',
    title: { en: 'New Features Released', el: 'Νέες δυνατότητες κυκλοφόρησαν' },
    excerpt: { en: 'Check out the latest features we have added to improve your experience.', el: 'Δείτε τις τελευταίες δυνατότητες που προσθέσαμε για να βελτιώσουμε την εμπειρία σας.' },
    content: { en: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', el: 'Αυτό είναι ένα παράδειγμα περιεχομένου για τις νέες δυνατότητες στα Ελληνικά.' },
    category: 'technology',
    published: true,
    featured: false,
    publishDate: '2024-01-10',
    createdAt: '2024-01-10T14:30:00.000Z',
    updatedAt: '2024-01-10T14:30:00.000Z',
  },
];

const initialEvents: EventItem[] = [
  {
    id: '1',
    title: { en: 'Tech Conference 2024', el: 'Τεχνολογικό Συνέδριο 2024' },
    description: { en: 'Join us for the annual tech conference featuring the latest innovations and networking opportunities.', el: 'Συμμετέχετε στο ετήσιο τεχνολογικό συνέδριο με τις τελευταίες καινοτομίες και ευκαιρίες δικτύωσης.' },
    date: '2024-03-15',
    time: '09:00',
    location: 'Convention Center, Tech City',
    category: 'conference',
    published: true,
    featured: true,
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: '2',
    title: { en: 'Workshop: Modern Web Development', el: 'Εργαστήριο: Σύγχρονη Ανάπτυξη Ιστού' },
    description: { en: 'Learn the latest web development techniques and best practices in this hands-on workshop.', el: 'Μάθετε τις τελευταίες τεχνικές ανάπτυξης ιστού και βέλτιστες πρακτικές σε αυτό το πρακτικό εργαστήριο.' },
    date: '2024-02-20',
    time: '14:00',
    location: 'Learning Lab, Innovation Hub',
    category: 'workshop',
    published: true,
    featured: false,
    createdAt: '2024-01-10T14:30:00.000Z',
    updatedAt: '2024-01-10T14:30:00.000Z',
  },
];

export const useContentStore = create<ContentStore>()(
  persist(
    (set) => ({
      news: initialNews,
      events: initialEvents,
      addNews: (news) => set((state) => ({ news: [...state.news, news] })),
      updateNews: (id, updates) =>
        set((state) => ({
          news: state.news.map((item) =>
            item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
          ),
        })),
      deleteNews: (id) =>
        set((state) => ({
          news: state.news.filter((item) => item.id !== id),
        })),
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEvent: (id, updates) =>
        set((state) => ({
          events: state.events.map((item) =>
            item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
          ),
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((item) => item.id !== id),
        })),
    }),
    {
      name: 'content-store',
    }
  )
);