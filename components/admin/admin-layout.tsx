'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, 
  FileText, 
  Calendar, 
  Settings, 
  Menu, 
  X,
  LogOut,
  Building,
  Landmark,
  Lock,
  Tag,
  Users,
  Heart,
  Globe,
  Palette,
  ChevronDown,
  ChevronRight,
  File
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TranslatableText } from '@/components/translatable-content';
import { motion } from 'framer-motion';
import { SimpleHeartbeatLoader } from '@/components/ui/heartbeat-loader';
import { getPageCategories, PageCategory, getAllMunicipalityPages, MunicipalityPage } from '@/lib/firestore';
import { useTranslation } from '@/hooks/useTranslation';

const navigation = [
  { name: { en: 'Dashboard', el: 'Πίνακας Ελέγχου' }, href: '/admin', icon: Home },
  { name: { en: 'News', el: 'Ειδήσεις' }, href: '/admin/news', icon: FileText },
  { name: { en: 'Events', el: 'Εκδηλώσεις' }, href: '/admin/events', icon: Calendar },
  { name: { en: 'Museums', el: 'Μουσεία' }, href: '/admin/museums', icon: Landmark },
  { name: { en: 'Pages', el: 'Σελίδες' }, href: '/admin/pages', icon: Building },
  { name: { en: 'Categories', el: 'Κατηγορίες' }, href: '/admin/categories', icon: Tag },
  { name: { en: 'Appearance', el: 'Εμφάνιση' }, href: '/admin/appearance', icon: Palette },
  { name: { en: 'Settings', el: 'Ρυθμίσεις' }, href: '/admin/settings', icon: Settings },
];

// Helper function to get icon component
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'building':
      return Building;
    case 'users':
      return Users;
    case 'settings':
      return Settings;
    case 'heart':
      return Heart;
    case 'tag':
      return Tag;
    default:
      return Building;
  }
};

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pageCategories, setPageCategories] = useState<PageCategory[]>([]);
  const [pages, setPages] = useState<MunicipalityPage[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  const safePathname = pathname || '';
  const { currentLang, setCurrentLang, isTranslating } = useTranslation();

  // Load page categories and pages from database
  useEffect(() => {
    const loadCategoriesAndPages = async () => {
      try {
        setLoadingCategories(true);
        const [categories, allPages] = await Promise.all([
          getPageCategories(),
          getAllMunicipalityPages()
        ]);
        setPageCategories(categories);
        setPages(allPages);
      } catch (error) {
        console.error('Error loading page categories and pages:', error);
        // Fallback to empty arrays if loading fails
        setPageCategories([]);
        setPages([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategoriesAndPages();
  }, []);

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Check password from localStorage (default to 'admin123')
    const correctPassword = localStorage.getItem('adminPassword') || 'admin123';
    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
    } else {
      setError('Incorrect password. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const getCategoryPages = (categoryId: string) => {
    return pages.filter(page => page.category === categoryId && page.isPublished);
  };

  // Show password screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-heading">
              <TranslatableText>{{ en: 'Admin Access', el: 'Πρόσβαση Διαχειριστή' }}</TranslatableText>
            </CardTitle>
            <p className="text-body/70 mt-2">
              <TranslatableText>{{ en: 'Enter password to access the admin panel', el: 'Εισάγετε τον κωδικό πρόσβασης για να μπείτε στον πίνακα διαχείρισης' }}</TranslatableText>
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder={currentLang === 'el' ? 'Εισάγετε κωδικό πρόσβασης' : 'Enter password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  autoFocus
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm text-center">
                  {currentLang === 'el' ? 'Λάθος κωδικός πρόσβασης. Παρακαλώ δοκιμάστε ξανά.' : error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <SimpleHeartbeatLoader size="sm" className="mr-2" />
                    <TranslatableText>{{ en: 'Checking...', el: 'Ελέγχος...' }}</TranslatableText>
                  </div>
                ) : (
                  <TranslatableText>{{ en: 'Access Admin Panel', el: 'Πρόσβαση στον Πίνακα Διαχείρισης' }}</TranslatableText>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card text-body shadow-lg border-r border-border transform transition-transform duration-300 ease-in-out xl-custom:translate-x-0 xl-custom:static xl-custom:inset-0 flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border bg-background flex-shrink-0">
          <Link href="/" className="text-xl font-bold text-heading">
            <TranslatableText>Admin Panel</TranslatableText>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="border-primary text-primary hover:bg-primary hover:text-white xl-custom:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Language Switcher */}
        <div className="px-4 py-3 border-b border-border bg-background flex-shrink-0">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
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
        </div>
        
        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <div className="px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-body hover:bg-accent/20 hover:text-primary"
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  <TranslatableText>{item.name}</TranslatableText>
                </Link>
              );
            })}
            {/* Page categories with dropdown */}
            <div className="mt-6">
              <div className="text-xs text-muted-foreground mb-2 px-2">
                <TranslatableText>{{ en: 'Page Categories', el: 'Κατηγορίες Σελίδων' }}</TranslatableText>
              </div>
              {loadingCategories ? (
                <div className="px-2 py-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <SimpleHeartbeatLoader size="sm" />
                    <TranslatableText>{{ en: 'Loading categories...', el: 'Φόρτωση κατηγοριών...' }}</TranslatableText>
                  </div>
                </div>
              ) : pageCategories.length > 0 ? (
                pageCategories
                  .filter(category => category.isActive !== false)
                  .sort((a, b) => (a.navOrder || 0) - (b.navOrder || 0))
                  .map((category) => {
                    const IconComponent = getIconComponent(category.icon || 'building');
                    const isCategoryActive = safePathname.startsWith('/admin/pages') && 
                      (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('category') === category.id);
                    const categoryPages = getCategoryPages(category.id);
                    const isExpanded = expandedCategories.has(category.id);
                    
                    return (
                      <div key={category.id} className="mb-1">
                        {/* Category Header */}
                        <div className="flex items-center">
                          <Link
                            href={`/admin/pages?category=${category.id}`}
                            className={cn(
                              "group flex-1 flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                              isCategoryActive
                                ? "bg-primary/10 text-primary"
                                : "text-body hover:bg-accent/20 hover:text-primary"
                            )}
                          >
                            <IconComponent className="mr-3 h-4 w-4" />
                            <TranslatableText>{category.name}</TranslatableText>
                            <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded-full">
                              {categoryPages.length}
                            </span>
                          </Link>
                          {categoryPages.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-1 p-1 h-8 w-8"
                              onClick={() => toggleCategoryExpansion(category.id)}
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                        </div>
                        
                        {/* Pages Dropdown */}
                        {isExpanded && categoryPages.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-6 mt-1 space-y-1"
                          >
                            {categoryPages.map((page) => {
                              const isPageActive = safePathname === `/admin/pages/${page.slug}` || 
                                (safePathname === '/admin/pages' && typeof window !== 'undefined' && 
                                 new URLSearchParams(window.location.search).get('edit') === page.id);
                              
                              return (
                                <Link
                                  key={page.id}
                                  href={`/admin/pages?edit=${page.id}`}
                                  className={cn(
                                    "group flex items-center px-2 py-1.5 text-xs rounded-md transition-colors",
                                    isPageActive
                                      ? "bg-primary/10 text-primary"
                                      : "text-muted-foreground hover:bg-accent/20 hover:text-body"
                                  )}
                                >
                                  <File className="mr-2 h-3 w-3" />
                                  <span className="truncate">
                                    <TranslatableText>{page.title}</TranslatableText>
                                  </span>
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </div>
                    );
                  })
              ) : (
                <div className="px-2 py-2">
                  <div className="text-sm text-muted-foreground">
                    <TranslatableText>{{ en: 'No categories found', el: 'Δεν βρέθηκαν κατηγορίες' }}</TranslatableText>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
        
        {/* Fixed Footer */}
        <div className="p-4 space-y-2 border-t border-border bg-background flex-shrink-0">
          <Button 
            variant="outline" 
            className="w-full justify-start border-red-500 text-red-500 hover:bg-red-500 hover:text-white" 
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            <TranslatableText>{{ en: 'Logout', el: 'Αποσύνδεση' }}</TranslatableText>
          </Button>
          <Button variant="outline" className="w-full justify-start border-primary text-primary hover:bg-primary hover:text-white" asChild>
            <a href="/" rel="external">
              <TranslatableText>{{ en: 'Back to Website', el: 'Επιστροφή στην Ιστοσελίδα' }}</TranslatableText>
            </a>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background text-body">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 px-4 bg-card border-b border-border shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary hover:text-white xl-custom:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold text-heading">
              <TranslatableText>{{ en: 'Admin Panel', el: 'Πίνακας Διαχείρισης' }}</TranslatableText>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">
              <TranslatableText>{{ en: 'Content Management System', el: 'Σύστημα Διαχείρισης Περιεχομένου' }}</TranslatableText>
            </span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}