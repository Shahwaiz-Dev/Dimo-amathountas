"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, Phone, Mail, Clock, Facebook, Instagram, ChevronDown } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { TranslatableText } from '@/components/translatable-content';
import { getAllMunicipalityPages, MunicipalityPage, getPageCategories, PageCategory, getNavbarCategories } from '@/lib/firestore';
import { motion, AnimatePresence, easeOut } from 'framer-motion';

// Add type definitions for Google Translate globals
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const dropdownVariants = {
  hidden: { 
    opacity: 0, 
    y: -10,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: easeOut
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15
    }
  }
};

const mobileMenuVariants = {
  hidden: { 
    opacity: 0, 
    x: '100%'
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: easeOut
    }
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: {
      duration: 0.2
    }
  }
};

const menuItemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: easeOut
    }
  })
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [pages, setPages] = useState<MunicipalityPage[]>([]);
  const [categories, setCategories] = useState<PageCategory[]>([]);
  const [navbarCategories, setNavbarCategories] = useState<PageCategory[]>([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingNavbarCategories, setLoadingNavbarCategories] = useState(true);
  const [isMunicipalityDropdownOpen, setIsMunicipalityDropdownOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isCitizenServicesDropdownOpen, setIsCitizenServicesDropdownOpen] = useState(false);
  const [isCivilMarriagesDropdownOpen, setIsCivilMarriagesDropdownOpen] = useState(false);
  const [isMobileMunicipalityOpen, setIsMobileMunicipalityOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobileCitizenServicesOpen, setIsMobileCitizenServicesOpen] = useState(false);
  const [isMobileCivilMarriagesOpen, setIsMobileCivilMarriagesOpen] = useState(false);
  const [dynamicDropdownStates, setDynamicDropdownStates] = useState<{ [key: string]: boolean }>({});
  const { currentLang, setCurrentLang, isTranslating } = useTranslation();

  const loadMunicipalityPages = async () => {
    try {
      setLoadingPages(true);
      const fetchedPages = await getAllMunicipalityPages();
      setPages(fetchedPages);
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setLoadingPages(false);
    }
  };

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const fetchedCategories = await getPageCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadNavbarCategories = async () => {
    try {
      setLoadingNavbarCategories(true);
      const fetchedNavbarCategories = await getNavbarCategories();
      setNavbarCategories(fetchedNavbarCategories);
    } catch (error) {
      console.error('Error loading navbar categories:', error);
    } finally {
      setLoadingNavbarCategories(false);
    }
  };

  useEffect(() => {
    loadMunicipalityPages();
    loadCategories();
    loadNavbarCategories();
  }, []);

  const handleCloseMenuAndSwitchLang = () => {
    setIsOpen(false);
  };

  const getLocalizedTitle = (title: { en: string; el: string }) => {
    return currentLang === 'el' ? title.el : title.en;
  };

  const toggleDynamicDropdown = (categoryId: string) => {
    setDynamicDropdownStates(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Filter pages by category - use only dynamic categories
  const municipalityPages = pages.filter(page => {
    const category = categories.find(cat => cat.id === page.category);
    return category && 
           (category.name.en.toLowerCase().includes('municipality') || 
            category.name.el.toLowerCase().includes('δήμος')) && 
           page.isPublished;
  });

  // Get all other dynamic categories and their pages
  const otherCategories = categories.filter(cat => {
    const catNameEn = cat.name.en.toLowerCase();
    const catNameEl = cat.name.el.toLowerCase();
    return !catNameEn.includes('municipality') && 
           !catNameEl.includes('δήμος');
  });

  // Group other dynamic pages by category
  const otherPagesByCategory = otherCategories.map(category => ({
    category,
    pages: pages.filter(page => page.category === category.id && page.isPublished)
  })).filter(group => group.pages.length > 0);

  // Combine all pages for More dropdown (only dynamic)
  const morePages = otherPagesByCategory.flatMap(group => group.pages);

  return (
    <header className="w-full">
      {/* Top Info Bar */}
      <motion.div 
        className="w-full bg-gradient-to-r from-indigo-700 via-purple-500 to-orange-400 text-white text-sm flex items-center px-4 py-1 justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
          <span className="flex items-center gap-1"><Clock className="w-4 h-4 mr-1" /> 
            {currentLang === 'el' ? 'Ωράριο Λειτουργίας: Δευτέρα – Παρασκευή 07:30 – 15:00' : 'Operating Hours: Monday – Friday 07:30 – 15:00'}
          </span>
          <span className="flex items-center gap-1"><Phone className="w-4 h-4 mr-1" />
            <a href="tel:25864100" className="hover:underline">25864100</a>
          </span>
          <span className="flex items-center gap-1"><Mail className="w-4 h-4 mr-1" />
            <a href="mailto:municipality@amathounta.org.cy" className="hover:underline">municipality@amathounta.org.cy</a>
          </span>
                          <span className="hidden xl-custom:flex items-center gap-1 text-xs opacity-90">
            {currentLang === 'el' ? 'Γραφείο Εξυπηρέτησης: 25864146' : 'Citizen Service: 25864146'}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Facebook className="w-4 h-4 cursor-pointer opacity-80 hover:opacity-100" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Instagram className="w-4 h-4 cursor-pointer opacity-80 hover:opacity-100" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <X className="w-4 h-4 cursor-pointer opacity-80 hover:opacity-100" />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Main Navbar */}
      <nav className="bg-white shadow border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 flex items-center justify-between h-24 relative">
          {/* Left Section - Logo & Branding */}
          <motion.div 
            className="flex items-center gap-4 min-w-[200px] flex-shrink-0 -ml-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div 
              className="relative flex items-center" 
              style={{ height: '100%' }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={100} 
                height={100} 
                className="rounded-full object-cover" 
                style={{ marginTop: '-16px', marginBottom: '-16px' }}
              />
            </motion.div>
            <div>
              <div className="font-extrabold text-xl text-heading leading-tight">
                <TranslatableText>Agios Athanasios</TranslatableText>
              </div>
              <div className="text-sm text-gray-500">
                <TranslatableText>Municipality</TranslatableText>
              </div>
            </div>
          </motion.div>

          {/* Center Section - Desktop Navigation */}
                        <div className="hidden xl-custom:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link href="/" className="relative text-gray-700 hover:text-indigo-600 font-medium transition-colors group text-base" style={{ textDecoration: 'none' }}>
                <span className="relative">
                  <TranslatableText>Home</TranslatableText>
                  <span className="absolute -top-1 left-0 w-0 h-0.5 bg-indigo-300 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link href="/news" className="relative text-gray-700 hover:text-indigo-600 font-medium transition-colors group text-base" style={{ textDecoration: 'none' }}>
                <span className="relative">
                  <TranslatableText>News</TranslatableText>
                  <span className="absolute -top-1 left-0 w-0 h-0.5 bg-indigo-300 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/events" className="relative text-gray-700 hover:text-indigo-600 font-medium transition-colors group text-base" style={{ textDecoration: 'none' }}>
                <span className="relative">
                  <TranslatableText>Events</TranslatableText>
                  <span className="absolute -top-1 left-0 w-0 h-0.5 bg-indigo-300 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Link href="/contact" className="relative text-gray-700 hover:text-indigo-600 font-medium transition-colors group text-base" style={{ textDecoration: 'none' }}>
                <span className="relative">
                  <TranslatableText>Contact</TranslatableText>
                  <span className="absolute -top-1 left-0 w-0 h-0.5 bg-indigo-300 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
            >
              <Link href="/museums" className="relative text-gray-700 hover:text-indigo-600 font-medium transition-colors group text-base" style={{ textDecoration: 'none' }}>
                <span className="relative">
                  <TranslatableText>Museums</TranslatableText>
                  <span className="absolute -top-1 left-0 w-0 h-0.5 bg-indigo-300 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
            </motion.div>
            
            {/* Dynamic Categories from Admin */}
            {!loadingNavbarCategories && navbarCategories.map((category, index) => {
              const categorySlug = (category as any).slug || category.name.en.toLowerCase().replace(/\s+/g, '-');
              const hasSubcategories = categories.some(cat => (cat as any).parentCategory === category.id && cat.isActive);
              
              return (
                <motion.div 
                  key={category.id}
                  className="relative group"
                  onMouseEnter={() => setDynamicDropdownStates(prev => ({ ...prev, [category.id]: true }))}
                  onMouseLeave={() => setDynamicDropdownStates(prev => ({ ...prev, [category.id]: false }))}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                >
                  {hasSubcategories ? (
                    <button 
                      className="relative text-gray-700 hover:text-indigo-600 font-medium transition-colors flex items-center gap-1 text-base"
                      onClick={() => setDynamicDropdownStates(prev => ({ ...prev, [category.id]: !prev[category.id] }))}
                    >
                      <span className="relative">
                        <TranslatableText>{category.name}</TranslatableText>
                        <span className="absolute -top-1 left-0 w-0 h-0.5 bg-indigo-300 transition-all duration-300 group-hover:w-full"></span>
                      </span>
                      <motion.div
                        animate={{ rotate: dynamicDropdownStates[category.id] ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </button>
                  ) : (
                    <Link 
                      href={`/${categorySlug}`}
                      className="relative text-gray-700 hover:text-indigo-600 font-medium transition-colors group text-base"
                      style={{ textDecoration: 'none' }}
                    >
                      <span className="relative">
                        <TranslatableText>{category.name}</TranslatableText>
                        <span className="absolute -top-1 left-0 w-0 h-0.5 bg-indigo-300 transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </Link>
                  )}
                  
                  {/* Subcategories Dropdown */}
                  {hasSubcategories && (
                    <AnimatePresence>
                      {dynamicDropdownStates[category.id] && (
                        <motion.div 
                          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50"
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <div className="py-1">
                            {categories
                              .filter(cat => (cat as any).parentCategory === category.id && cat.isActive)
                              .map((subcat) => (
                                <Link 
                                  key={subcat.id}
                                  href={`/${(subcat as any).slug || subcat.name.en.toLowerCase().replace(/\s+/g, '-')}`}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                                  style={{ textDecoration: 'none' }}
                                  onClick={() => setDynamicDropdownStates({})}
                                >
                                  <TranslatableText>{subcat.name}</TranslatableText>
                                </Link>
                              ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </motion.div>
              );
            })}

            {/* Municipality Dropdown */}
            <motion.div 
              className="relative group"
              onMouseEnter={() => setIsMunicipalityDropdownOpen(true)}
              onMouseLeave={() => setIsMunicipalityDropdownOpen(false)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + (navbarCategories.length * 0.1) }}
            >
              <button 
                className="relative text-gray-700 hover:text-indigo-600 font-medium transition-colors flex items-center gap-1 text-base"
                onClick={() => setIsMunicipalityDropdownOpen(!isMunicipalityDropdownOpen)}
              >
                <span className="relative">
                  <TranslatableText>Municipality</TranslatableText>
                  <span className="absolute -top-1 left-0 w-0 h-0.5 bg-indigo-300 transition-all duration-300 group-hover:w-full"></span>
                </span>
                <motion.div
                  animate={{ rotate: isMunicipalityDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </button>
              
              {/* Dropdown Content */}
              <AnimatePresence>
                {isMunicipalityDropdownOpen && (
                  <motion.div 
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="py-1">
                      {loadingPages ? (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          Loading municipality pages...
                        </div>
                      ) : municipalityPages.length > 0 ? (
                        municipalityPages.map((page, index) => (
                          <motion.div
                            key={page.slug}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link 
                              href={`/municipality/${page.slug}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 active:text-gray-700 focus:text-gray-700 transition-colors"
                              style={{ textDecoration: 'none' }}
                              onClick={() => setIsMunicipalityDropdownOpen(false)}
                            >
                              {getLocalizedTitle(page.title)}
                            </Link>
                          </motion.div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          No pages available
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* More Dropdown */}
            <motion.div 
              className="relative group"
              onMouseEnter={() => setIsMoreDropdownOpen(true)}
              onMouseLeave={() => setIsMoreDropdownOpen(false)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <button 
                className="relative text-gray-700 hover:text-indigo-600 font-medium transition-colors flex items-center gap-1 text-base"
                onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
              >
                <span className="relative">
                  <TranslatableText>More</TranslatableText>
                  <span className="absolute -top-1 left-0 w-0 h-0.5 bg-indigo-300 transition-all duration-300 group-hover:w-full"></span>
                </span>
                <motion.div
                  animate={{ rotate: isMoreDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </button>
              
              {/* Dropdown Content */}
              <AnimatePresence>
                {isMoreDropdownOpen && (
                  <motion.div 
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="py-1">
                      {loadingPages || loadingCategories ? (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          Loading pages...
                        </div>
                      ) : morePages.length > 0 ? (
                        <div className="space-y-1">
                          {/* Services Category */}
                          {/* Removed hardcoded services pages */}

                          {/* Citizen Services Category */}
                          {/* Removed hardcoded citizen services pages */}

                          {/* Civil Marriages Category */}
                          {/* Removed hardcoded civil marriages pages */}

                          {/* Other Dynamic Categories */}
                          {otherPagesByCategory.map((group) => (
                            <div key={group.category.id} className="relative">
                              <div 
                                className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors cursor-pointer"
                                onClick={() => toggleDynamicDropdown(group.category.id)}
                              >
                                <span>
                                  <TranslatableText>{group.category.name}</TranslatableText>
                                </span>
                                <motion.div
                                  animate={{ rotate: dynamicDropdownStates[group.category.id] ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </motion.div>
                              </div>
                              
                              {/* Dynamic Category Sub-dropdown */}
                              <AnimatePresence>
                                {dynamicDropdownStates[group.category.id] && (
                                  <motion.div 
                                    className="absolute left-0 top-full mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50"
                                    variants={dropdownVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                  >
                                    <div className="py-1">
                                      {group.pages.map((page, index) => (
                                        <motion.div
                                          key={page.slug}
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: index * 0.05 }}
                                        >
                                          <Link 
                                            href={`/${group.category.name.en.toLowerCase().replace(/\s+/g, '-')}/${page.slug}`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 active:text-gray-700 focus:text-gray-700 transition-colors"
                                            style={{ textDecoration: 'none' }}
                                            onClick={() => {
                                              setIsMoreDropdownOpen(false);
                                              setDynamicDropdownStates({});
                                            }}
                                          >
                                            {getLocalizedTitle(page.title)}
                                          </Link>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          No pages available
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Section - Language Switcher & Mobile Menu Button */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            {/* Desktop Language Switcher */}
                              <div className="hidden xl-custom:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <motion.button
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentLang === 'en' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setCurrentLang('en')}
                disabled={isTranslating}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                EN {isTranslating && currentLang !== 'en' && <span className="ml-1 animate-spin">⏳</span>}
              </motion.button>
              <motion.button
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentLang === 'el' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setCurrentLang('el')}
                disabled={isTranslating}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ΕΛ {isTranslating && currentLang !== 'el' && <span className="ml-1 animate-spin">⏳</span>}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="relative w-10 h-10 flex flex-col justify-center items-center group xl-custom:hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative w-6 h-6">
                <motion.span
                  className="absolute top-0 left-0 w-6 h-0.5 bg-gray-700 rounded-full origin-center"
                  animate={{
                    rotate: isOpen ? 45 : 0,
                    y: isOpen ? 8 : 0,
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
                <motion.span
                  className="absolute top-1/2 left-0 w-6 h-0.5 bg-gray-700 rounded-full -translate-y-1/2"
                  animate={{
                    opacity: isOpen ? 0 : 1,
                    x: isOpen ? -20 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
                <motion.span
                  className="absolute bottom-0 left-0 w-6 h-0.5 bg-gray-700 rounded-full origin-center"
                  animate={{
                    rotate: isOpen ? -45 : 0,
                    y: isOpen ? -8 : 0,
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
            </motion.button>
          </motion.div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-50 xl-custom:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Content */}
            <motion.div 
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl flex flex-col"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="p-6 flex-shrink-0">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-gray-900">
                    <TranslatableText>Menu</TranslatableText>
                  </h2>
                  
                  {/* Mobile Language Switcher */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <motion.button
                      className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                        currentLang === 'en' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setCurrentLang('en')}
                      disabled={isTranslating}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      EN {isTranslating && currentLang !== 'en' && <span className="ml-1 animate-spin">⏳</span>}
                    </motion.button>
                    <motion.button
                      className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                        currentLang === 'el' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setCurrentLang('el')}
                      disabled={isTranslating}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ΕΛ {isTranslating && currentLang !== 'el' && <span className="ml-1 animate-spin">⏳</span>}
                    </motion.button>
                  </div>
                  
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                <nav className="space-y-4">
                  {/* Mobile Menu Items */}
                  <motion.div custom={0} variants={menuItemVariants} initial="hidden" animate="visible">
                    <Link 
                      href="/" 
                      className="block py-3 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                      style={{ textDecoration: 'none' }}
                      onClick={() => setIsOpen(false)}
                    >
                      <TranslatableText>Home</TranslatableText>
                    </Link>
                  </motion.div>
                  
                  {/* Municipality Dropdown */}
                  <motion.div custom={1} variants={menuItemVariants} initial="hidden" animate="visible">
                    <button 
                      className="w-full text-left py-3 text-gray-700 hover:text-indigo-600 font-medium transition-colors flex items-center justify-between"
                      onClick={() => setIsMobileMunicipalityOpen(!isMobileMunicipalityOpen)}
                    >
                      <TranslatableText>Municipality</TranslatableText>
                      <motion.div
                        animate={{ rotate: isMobileMunicipalityOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {isMobileMunicipalityOpen && (
                        <motion.div 
                          className="ml-4 space-y-2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {loadingPages ? (
                            <div className="py-2 text-sm text-gray-500">
                              Loading municipality pages...
                            </div>
                          ) : municipalityPages.length > 0 ? (
                            municipalityPages.map((page, index) => (
                              <motion.div
                                key={page.slug}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Link 
                                  href={`/municipality/${page.slug}`}
                                  className="block py-2 text-sm text-gray-600 hover:text-indigo-600 active:text-gray-600 focus:text-gray-600 transition-colors"
                                  style={{ textDecoration: 'none' }}
                                  onClick={() => setIsOpen(false)}
                                >
                                  {getLocalizedTitle(page.title)}
                                </Link>
                              </motion.div>
                            ))
                          ) : (
                            <div className="py-2 text-sm text-gray-500">
                              No pages available
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  
                  <motion.div custom={2} variants={menuItemVariants} initial="hidden" animate="visible">
                    <Link 
                      href="/news" 
                      className="block py-3 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                      style={{ textDecoration: 'none' }}
                      onClick={() => setIsOpen(false)}
                    >
                      <TranslatableText>News</TranslatableText>
                    </Link>
                  </motion.div>
                  
                  <motion.div custom={3} variants={menuItemVariants} initial="hidden" animate="visible">
                    <Link 
                      href="/events" 
                      className="block py-3 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                      style={{ textDecoration: 'none' }}
                      onClick={() => setIsOpen(false)}
                    >
                      <TranslatableText>Events</TranslatableText>
                    </Link>
                  </motion.div>
                  
                  <motion.div custom={4} variants={menuItemVariants} initial="hidden" animate="visible">
                    <Link 
                      href="/contact" 
                      className="block py-3 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                      style={{ textDecoration: 'none' }}
                      onClick={() => setIsOpen(false)}
                    >
                      <TranslatableText>Contact</TranslatableText>
                    </Link>
                  </motion.div>
                  
                  <motion.div custom={5} variants={menuItemVariants} initial="hidden" animate="visible">
                    <Link 
                      href="/museums" 
                      className="block py-3 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                      style={{ textDecoration: 'none' }}
                      onClick={() => setIsOpen(false)}
                    >
                      <TranslatableText>Museums</TranslatableText>
                    </Link>
                  </motion.div>
                  
                  {/* Dynamic Categories in Mobile Menu */}
                  {!loadingNavbarCategories && navbarCategories.map((category, index) => {
                    const categorySlug = (category as any).slug || category.name.en.toLowerCase().replace(/\s+/g, '-');
                    const hasSubcategories = categories.some(cat => (cat as any).parentCategory === category.id && cat.isActive);
                    
                    return (
                      <motion.div 
                        key={category.id}
                        custom={6 + index} 
                        variants={menuItemVariants} 
                        initial="hidden" 
                        animate="visible"
                      >
                        {hasSubcategories ? (
                          <button 
                            className="w-full text-left py-3 text-gray-700 hover:text-indigo-600 font-medium transition-colors flex items-center justify-between"
                            onClick={() => toggleDynamicDropdown(category.id)}
                          >
                            <TranslatableText>{category.name}</TranslatableText>
                            <motion.div
                              animate={{ rotate: dynamicDropdownStates[category.id] ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </motion.div>
                          </button>
                        ) : (
                          <Link 
                            href={`/${categorySlug}`}
                            className="block py-3 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                            style={{ textDecoration: 'none' }}
                            onClick={() => setIsOpen(false)}
                          >
                            <TranslatableText>{category.name}</TranslatableText>
                          </Link>
                        )}
                        
                        {/* Subcategories in Mobile */}
                        {hasSubcategories && (
                          <AnimatePresence>
                            {dynamicDropdownStates[category.id] && (
                              <motion.div 
                                className="ml-4 space-y-2"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                {categories
                                  .filter(cat => (cat as any).parentCategory === category.id && cat.isActive)
                                  .map((subcat) => (
                                    <Link 
                                      key={subcat.id}
                                      href={`/${(subcat as any).slug || subcat.name.en.toLowerCase().replace(/\s+/g, '-')}`}
                                      className="block py-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                                      onClick={() => setIsOpen(false)}
                                    >
                                      <TranslatableText>{subcat.name}</TranslatableText>
                                    </Link>
                                  ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </motion.div>
                    );
                  })}
                  
                  {/* More Dropdown */}
                  <motion.div custom={6} variants={menuItemVariants} initial="hidden" animate="visible">
                    <button 
                      className="w-full text-left py-3 text-gray-700 hover:text-indigo-600 font-medium transition-colors flex items-center justify-between"
                      onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
                    >
                      <TranslatableText>More</TranslatableText>
                      <motion.div
                        animate={{ rotate: isMobileMoreOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {isMobileMoreOpen && (
                        <motion.div 
                          className="ml-4 space-y-2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {loadingPages ? (
                            <div className="py-2 text-sm text-gray-500">
                              Loading pages...
                            </div>
                          ) : morePages.length > 0 ? (
                            <div className="space-y-2">
                              {/* Services Category */}
                              {/* Removed hardcoded services pages */}

                              {/* Citizen Services Category */}
                              {/* Removed hardcoded citizen services pages */}

                              {/* Civil Marriages Category */}
                              {/* Removed hardcoded civil marriages pages */}

                              {/* Dynamic Categories */}
                              {otherPagesByCategory.map((group) => (
                                <div key={group.category.id}>
                                  <button 
                                    className="w-full text-left py-2 text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors flex items-center justify-between"
                                    onClick={() => toggleDynamicDropdown(group.category.id)}
                                  >
                                    <span>
                                      <TranslatableText>{group.category.name}</TranslatableText>
                                    </span>
                                    <motion.div
                                      animate={{ rotate: dynamicDropdownStates[group.category.id] ? 180 : 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <ChevronDown className="h-4 w-4" />
                                    </motion.div>
                                  </button>
                                  
                                  <AnimatePresence>
                                    {dynamicDropdownStates[group.category.id] && (
                                      <motion.div 
                                        className="ml-4 space-y-1"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        {group.pages.map((page, index) => (
                                          <motion.div
                                            key={page.slug}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                          >
                                            <Link 
                                              href={`/${group.category.name.en.toLowerCase().replace(/\s+/g, '-')}/${page.slug}`}
                                              className="block py-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                                              onClick={() => setIsOpen(false)}
                                            >
                                              {getLocalizedTitle(page.title)}
                                            </Link>
                                          </motion.div>
                                        ))}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="py-2 text-sm text-gray-500">
                              No pages available
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}