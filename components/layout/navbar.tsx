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
import { useAppearanceSettings } from '@/hooks/useAppearanceSettings';

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
  const [dynamicDropdownStates, setDynamicDropdownStates] = useState<{ [key: string]: boolean }>({});
  const { currentLang, setCurrentLang, isTranslating } = useTranslation();
  const { settings: appearanceSettings, loading: loadingAppearance } = useAppearanceSettings();
  
  // Fallback to default navigation order if settings fail to load
  const navigationOrder = loadingAppearance || !appearanceSettings?.mainNavigationOrder
    ? ['contact']
    : appearanceSettings.mainNavigationOrder.filter(item => item !== 'home' && item !== 'news' && item !== 'events' && item !== 'museums');

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

  // Get all categories and their pages for dynamic navigation
  const allCategoriesWithPages = categories.map(category => ({
    category,
    pages: pages.filter(page => page.category === category.id && page.isPublished)
  })).filter(group => group.pages.length > 0);

  // Get categories that should appear in navbar (excluding the main navbar categories)
  const dropdownCategories = allCategoriesWithPages.filter(group => 
    !navbarCategories.some(navCat => navCat.id === group.category.id)
  );

  // Get categories that should appear in navbar (max 10)
  const navbarCategoriesToShow = navbarCategories.slice(0, 10);

  // Function to render main navigation items based on custom order
  const renderMainNavigationItem = (item: string, index: number) => {
    const baseDelay = 0.4;
    const itemDelay = baseDelay + (index * 0.1);

    switch (item) {
      case 'contact':
        return (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: itemDelay }}
          >
            <Link href="/contact" className="relative text-gray-700 hover:text-indigo-600 font-medium transition-colors group text-base" style={{ textDecoration: 'none' }}>
              <span className="relative">
                <TranslatableText>Contact</TranslatableText>
                <span className="absolute -top-1 left-0 w-0 h-0.5 bg-indigo-300 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Function to render mobile navigation items based on custom order
  const renderMobileNavigationItem = (item: string, custom: number) => {
    switch (item) {
      case 'contact':
        return (
          <Link
            key="contact"
            href="/contact"
            className="block py-3 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            style={{ textDecoration: 'none' }}
            onClick={() => setIsOpen(false)}
          >
            <TranslatableText>Contact</TranslatableText>
          </Link>
        );

      default:
        return null;
    }
  };

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
      <nav className="bg-white shadow border-b border-border sticky top-0 z-50 overflow-visible">
        <div className="container mx-auto px-4 overflow-visible">
          {/* Three-Column Layout */}
          <div className="grid grid-cols-12 gap-4 items-center h-24 overflow-visible">
            
            {/* Left Column - Logo & Branding (3 columns on desktop, 8 columns on mobile) */}
          <motion.div 
              className="col-span-8 lg:col-span-3 flex items-center justify-start gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div 
              className="relative flex items-center" 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Image 
                src="/logo.png" 
                alt="Logo" 
                  width={100} 
                  height={100} 
                className="rounded-full object-cover" 
              />
            </motion.div>
              <div className="hidden xs:block sm:block">
                <div className="font-extrabold text-lg sm:text-xl xl:text-2xl text-heading leading-tight">
                <TranslatableText>Dimos Amathountas</TranslatableText>
              </div>
            </div>
          </motion.div>

            {/* Center Column - Navigation Links (6 columns) */}
            <div className="hidden lg:block col-span-6 relative">
              <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 max-h-20 overflow-visible relative">
                        {/* Dynamic Categories from Admin */}
            {!loadingNavbarCategories && navbarCategoriesToShow.map((category, index) => {
              // Show categories that have subcategories OR pages
              const hasSubcategories = categories.some(cat => (cat as any).parentCategory === category.id && cat.isActive);
              const hasPages = pages.some(page => page.category === category.id && page.isPublished);
              
              // Skip categories that have neither subcategories nor pages
              if (!hasSubcategories && !hasPages) return null;
              
              return (
                <motion.div 
                  key={category.id}
                  className="relative group z-10"
                  onMouseEnter={() => setDynamicDropdownStates(prev => ({ ...prev, [category.id]: true }))}
                  onMouseLeave={() => setDynamicDropdownStates(prev => ({ ...prev, [category.id]: false }))}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                >
                  {/* Category Button (Always a dropdown trigger) */}
                  <button 
                        className="relative text-gray-700 hover:text-indigo-600 font-medium transition-all duration-200 group flex items-center gap-1 text-sm xl:text-base hover:-translate-y-0.5 whitespace-nowrap max-w-[120px] xl:max-w-[150px]"
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
                          <ChevronDown className="h-3 w-3 xl:h-4 xl:w-4" />
                    </motion.div>
                  </button>
                  
                  {/* Subcategories Dropdown with Links to Actual Pages */}
                  <AnimatePresence>
                    {dynamicDropdownStates[category.id] && (
                      <motion.div 
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-white rounded-md shadow-xl border border-gray-200 z-[99999]"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{ 
                          zIndex: 99999, 
                          position: 'absolute',
                          backgroundColor: 'white',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                        }}
                      >
                        <div className="py-1">
                          {/* First, show pages directly under the main category (without heading) */}
                          {(() => {
                            const categoryPages = pages.filter(page => page.category === category.id && page.isPublished);
                            return categoryPages.map((page) => (
                              <Link 
                                key={page.id}
                                href={`/citizen-services/${page.slug}`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                                style={{ textDecoration: 'none' }}
                                onClick={() => setDynamicDropdownStates({})}
                              >
                                <TranslatableText>{page.title}</TranslatableText>
                              </Link>
                            ));
                          })()}
                          
                          {/* Add separator if there are both category pages and subcategories */}
                          {(() => {
                            const categoryPages = pages.filter(page => page.category === category.id && page.isPublished);
                            const hasSubcategories = categories.some(cat => (cat as any).parentCategory === category.id && cat.isActive);
                            if (categoryPages.length > 0 && hasSubcategories) {
                              return <div className="border-t border-gray-100 my-1"></div>;
                            }
                            return null;
                          })()}
                          
                          {/* Then show subcategories as expandable dropdown items */}
                          {categories
                            .filter(cat => (cat as any).parentCategory === category.id && cat.isActive)
                            .map((subcat) => {
                              // Get pages for this subcategory
                              const subcatPages = pages.filter(page => page.category === subcat.id && page.isPublished);
                              const subcatDropdownKey = `${category.id}-${subcat.id}`;
                              
                              return (
                                <div key={subcat.id} className="relative group/subcat">
                                  {/* Subcategory dropdown button */}
                                  <button 
                                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors flex items-center justify-between"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDynamicDropdownStates(prev => ({ 
                                        ...prev, 
                                        [subcatDropdownKey]: !prev[subcatDropdownKey] 
                                      }));
                                    }}
                                  >
                                    <TranslatableText>{subcat.name}</TranslatableText>
                                    <motion.div
                                      animate={{ rotate: dynamicDropdownStates[subcatDropdownKey] ? 180 : 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <ChevronDown className="h-3 w-3" />
                                    </motion.div>
                                  </button>
                                  
                                  {/* Subcategory pages dropdown */}
                                  <AnimatePresence>
                                    {dynamicDropdownStates[subcatDropdownKey] && (
                                      <motion.div 
                                        className="ml-4 border-l border-gray-200 pl-2"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        {subcatPages.length > 0 ? (
                                          subcatPages.map((page) => (
                                    <Link 
                                      key={page.id}
                                      href={`/citizen-services/${page.slug}`}
                                              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                                      style={{ textDecoration: 'none' }}
                                      onClick={() => setDynamicDropdownStates({})}
                                    >
                                      <TranslatableText>{page.title}</TranslatableText>
                                    </Link>
                                          ))
                                        ) : (
                                          <div className="px-4 py-2 text-xs text-gray-400 italic">
                                      <TranslatableText>{{ en: 'No pages yet', el: 'Δεν υπάρχουν σελίδες ακόμα' }}</TranslatableText>
                                    </div>
                                  )}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
              
              {/* Contact Link - Added after categories */}
              {!loadingAppearance && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <Link href="/contact" className="relative text-gray-700 hover:text-indigo-600 font-medium transition-all duration-200 group text-sm xl:text-base hover:-translate-y-0.5 whitespace-nowrap" style={{ textDecoration: 'none' }}>
                    <span className="relative">
                      <TranslatableText>Contact</TranslatableText>
                      <span className="absolute -top-1 left-0 w-0 h-0.5 bg-indigo-300 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>

            {/* Right Column - Language Switcher & Mobile Menu (4 columns on mobile, 3 columns on desktop) */}
          <motion.div 
              className="col-span-4 lg:col-span-3 flex items-center justify-end gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
              {/* Mobile Language Switcher - Compact */}
              <div className="flex lg:hidden items-center gap-1 bg-gray-100 rounded-lg p-1">
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
                  EN
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
                  ΕΛ
                </motion.button>
              </div>

            {/* Desktop Language Switcher */}
              <div className="hidden lg:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
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
                className="relative w-10 h-10 flex flex-col justify-center items-center group lg:hidden"
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
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-50 lg:hidden"
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
                  {/* Dynamic Mobile Menu Items */}
                  {loadingAppearance ? (
                    // Loading skeleton for mobile menu items
                    Array.from({ length: 5 }).map((_, index) => (
                      <motion.div 
                        key={`loading-mobile-${index}`}
                        custom={index} 
                        variants={menuItemVariants} 
                        initial="hidden" 
                        animate="visible"
                      >
                        <div className="block py-3">
                          <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    navigationOrder.map((item, index) => (
                      <motion.div 
                        key={item}
                        custom={index} 
                        variants={menuItemVariants} 
                        initial="hidden" 
                        animate="visible"
                      >
                        {renderMobileNavigationItem(item, index)}
                      </motion.div>
                    ))
                  )}
                  
                  {/* Dynamic Categories in Mobile Menu (Max 10) */}
                  {!loadingNavbarCategories && navbarCategoriesToShow.map((category, index) => {
                    // Show categories that have subcategories OR pages
                    const hasSubcategories = categories.some(cat => (cat as any).parentCategory === category.id && cat.isActive);
                    const hasPages = pages.some(page => page.category === category.id && page.isPublished);
                    
                    // Skip categories that have neither subcategories nor pages
                    if (!hasSubcategories && !hasPages) return null;
                    
                    return (
                      <motion.div 
                        key={category.id}
                        custom={6 + index} 
                        variants={menuItemVariants} 
                        initial="hidden" 
                        animate="visible"
                      >
                        {/* Category Button (Always a dropdown trigger) */}
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
                        
                        {/* Subcategories and Pages in Mobile */}
                        <AnimatePresence>
                          {dynamicDropdownStates[category.id] && (
                            <motion.div 
                              className="ml-4 space-y-2"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {/* First, show pages directly under the main category (without heading) */}
                              {(() => {
                                const categoryPages = pages.filter(page => page.category === category.id && page.isPublished);
                                return categoryPages.map((page) => (
                                  <Link 
                                    key={page.id}
                                    href={`/citizen-services/${page.slug}`}
                                    className="block py-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    <TranslatableText>{page.title}</TranslatableText>
                                  </Link>
                                ));
                              })()}
                              
                              {/* Add separator if there are both category pages and subcategories */}
                              {(() => {
                                const categoryPages = pages.filter(page => page.category === category.id && page.isPublished);
                                const hasSubcategories = categories.some(cat => (cat as any).parentCategory === category.id && cat.isActive);
                                if (categoryPages.length > 0 && hasSubcategories) {
                                  return <div className="border-t border-gray-100 my-2"></div>;
                                }
                                return null;
                              })()}
                              
                              {/* Then show subcategories as expandable dropdown items */}
                              {categories
                                .filter(cat => (cat as any).parentCategory === category.id && cat.isActive)
                                .map((subcat) => {
                                  // Get pages for this subcategory
                                  const subcatPages = pages.filter(page => page.category === subcat.id && page.isPublished);
                                  const subcatDropdownKey = `mobile-${category.id}-${subcat.id}`;
                                  
                                  return (
                                    <div key={subcat.id} className="space-y-1">
                                      {/* Subcategory dropdown button */}
                                      <button 
                                        className="w-full text-left py-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors flex items-center justify-between"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setDynamicDropdownStates(prev => ({ 
                                            ...prev, 
                                            [subcatDropdownKey]: !prev[subcatDropdownKey] 
                                          }));
                                        }}
                                      >
                                        <TranslatableText>{subcat.name}</TranslatableText>
                                        <motion.div
                                          animate={{ rotate: dynamicDropdownStates[subcatDropdownKey] ? 180 : 0 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          <ChevronDown className="h-3 w-3" />
                                        </motion.div>
                                      </button>
                                      
                                      {/* Subcategory pages dropdown */}
                                      <AnimatePresence>
                                        {dynamicDropdownStates[subcatDropdownKey] && (
                                          <motion.div 
                                            className="ml-4 border-l border-gray-200 pl-2 space-y-1"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                          >
                                            {subcatPages.length > 0 ? (
                                              subcatPages.map((page) => (
                                        <Link 
                                          key={page.id}
                                          href={`/citizen-services/${page.slug}`}
                                                  className="block py-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                                          onClick={() => setIsOpen(false)}
                                        >
                                          <TranslatableText>{page.title}</TranslatableText>
                                        </Link>
                                              ))
                                            ) : (
                                              <div className="py-2 text-xs text-gray-400 italic">
                                          <TranslatableText>{{ en: 'No pages yet', el: 'Δεν υπάρχουν σελίδες ακόμα' }}</TranslatableText>
                                        </div>
                                      )}
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  );
                                })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                  
                  {/* Contact Link in Mobile Menu - Added after categories */}
                  {!loadingAppearance && (
                    <motion.div 
                      custom={10} 
                      variants={menuItemVariants} 
                      initial="hidden" 
                      animate="visible"
                    >
                      <Link
                        href="/contact"
                        className="block py-3 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                        style={{ textDecoration: 'none' }}
                        onClick={() => setIsOpen(false)}
                      >
                        <TranslatableText>Contact</TranslatableText>
                      </Link>
                    </motion.div>
                  )}

                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}