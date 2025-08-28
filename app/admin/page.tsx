'use client';

import { useState, useEffect } from 'react';
import { DashboardStats } from '@/components/admin/dashboard-stats';
import { RecentContent } from '@/components/admin/recent-content';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { TranslatableText } from '@/components/translatable-content';
import { motion, easeOut } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  fetchNews, 
  fetchEvents, 
  fetchMuseums, 
  getAllMunicipalityPages, 
  getPageCategories 
} from '@/lib/firestore';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const sectionVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easeOut
    }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: easeOut
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

export default function AdminPage() {
  const [search, setSearch] = useState('');
  const { currentLang } = useTranslation();
  const [dashboardData, setDashboardData] = useState<{
    news: any[];
    events: any[];
    museums: any[];
    pages: any[];
    categories: any[];
    loading: boolean;
    error: string | null;
  }>({
    news: [],
    events: [],
    museums: [],
    pages: [],
    categories: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setDashboardData(prev => ({ ...prev, loading: true, error: null }));
        
        const [news, events, museums, pages, categories] = await Promise.all([
          fetchNews(),
          fetchEvents(),
          fetchMuseums(),
          getAllMunicipalityPages(),
          getPageCategories()
        ]);

        setDashboardData({
          news,
          events,
          museums,
          pages,
          categories,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load dashboard data'
        }));
      }
    };

    loadDashboardData();
  }, []);

  if (dashboardData.loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              <TranslatableText>{{ en: "Dashboard", el: "Πίνακας Ελέγχου" }}</TranslatableText>
            </h1>
            <p className="text-gray-600">
              <TranslatableText>{{ en: "Loading dashboard data...", el: "Φόρτωση δεδομένων πίνακα ελέγχου..." }}</TranslatableText>
            </p>
          </div>
        </div>
        <DashboardStats 
          newsCount={0} 
          eventsCount={0}
          museumsCount={0}
          pagesCount={0}
          categoriesCount={0}
          loading={true}
        />
        <RecentContent 
          search="" 
          news={[]}
          events={[]}
          loading={true}
        />
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800">Error Loading Dashboard</h2>
          <p className="text-red-600">{dashboardData.error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-8 text-white shadow-2xl"
        variants={sectionVariants}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    <TranslatableText>{{ en: "Dashboard", el: "Πίνακας Ελέγχου" }}</TranslatableText>
                  </h1>
                  <p className="text-blue-100 text-lg">
                    <TranslatableText>{{ en: "Welcome to your content management system", el: "Καλώς ήρθατε στο σύστημα διαχείρισης περιεχομένου σας" }}</TranslatableText>
                  </p>
                </div>
              </div>
            </div>
            <motion.div 
              className="flex gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button asChild className="bg-white/20 hover:bg-white/30 text-white font-semibold border-white/30 backdrop-blur-sm">
                  <Link href="/admin/news">
                    <TranslatableText>{{ en: "Create News", el: "Δημιουργία Ειδήσεων" }}</TranslatableText>
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button asChild className="bg-white/20 hover:bg-white/30 text-white font-semibold border-white/30 backdrop-blur-sm">
                  <Link href="/admin/events">
                    <TranslatableText>{{ en: "Create Event", el: "Δημιουργία Εκδήλωσης" }}</TranslatableText>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div variants={sectionVariants}>
        <DashboardStats 
          newsCount={dashboardData.news.length} 
          eventsCount={dashboardData.events.length}
          museumsCount={dashboardData.museums.length}
          pagesCount={dashboardData.pages.length}
          categoriesCount={dashboardData.categories.length}
          loading={dashboardData.loading}
        />
      </motion.div>
      
      <motion.div 
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        variants={sectionVariants}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            <TranslatableText>{{ en: "Recent Content", el: "Πρόσφατο Περιεχόμενο" }}</TranslatableText>
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative"
        >
          <input
            type="text"
            placeholder={currentLang === 'el' ? 'Αναζήτηση ειδήσεων ή εκδηλώσεων...' : 'Search news or events...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-80 px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:scale-105 focus:scale-105"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </motion.div>
      </motion.div>
      
      <motion.div variants={sectionVariants}>
        <RecentContent 
          search={search} 
          news={dashboardData.news}
          events={dashboardData.events}
          loading={dashboardData.loading}
        />
      </motion.div>
    </motion.div>
  );
}