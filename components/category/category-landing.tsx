'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, FileText, Calendar, MapPin } from 'lucide-react';
import { 
  getPageCategories, 
  getAllMunicipalityPages, 
  getSubcategories,
  PageCategory,
  MunicipalityPage 
} from '@/lib/firestore';
import { TranslatableText } from '@/components/translatable-content';
import { useTranslation } from '@/hooks/useTranslation';

interface CategoryLandingProps {
  categorySlug: string;
}

export function CategoryLanding({ categorySlug }: CategoryLandingProps) {
  const [category, setCategory] = useState<PageCategory | null>(null);
  const [subcategories, setSubcategories] = useState<PageCategory[]>([]);
  const [pages, setPages] = useState<MunicipalityPage[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentLang } = useTranslation();

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        setLoading(true);
        
        // Get all categories to find the matching one
        const allCategories = await getPageCategories();
        const matchingCategory = allCategories.find(cat => 
          cat.slug === categorySlug || 
          cat.name.en.toLowerCase().replace(/\s+/g, '-') === categorySlug ||
          cat.name.el.toLowerCase().replace(/\s+/g, '-') === categorySlug
        );

        if (!matchingCategory) {
          console.error('Category not found:', categorySlug);
          return;
        }

        setCategory(matchingCategory);

        // Get subcategories
        const subcats = await getSubcategories(matchingCategory.id);
        setSubcategories(subcats);

        // Get all pages to filter by category
        const allPages = await getAllMunicipalityPages();
        const categoryPages = allPages.filter(page => 
          page.category === matchingCategory.id && page.isPublished
        );
        setPages(categoryPages);

      } catch (error) {
        console.error('Error loading category data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <motion.div 
            className="mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-lg text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600">The requested category could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          <TranslatableText>{category.name}</TranslatableText>
        </h1>
        {category.description && (
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            <TranslatableText>{category.description}</TranslatableText>
          </p>
        )}
      </motion.div>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            <TranslatableText>{{ en: 'Subcategories', el: 'Υποκατηγορίες' }}</TranslatableText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcategories.map((subcat, index) => (
              <motion.div
                key={subcat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      <TranslatableText>{subcat.name}</TranslatableText>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {subcat.description && (
                      <p className="text-gray-600 mb-4">
                        <TranslatableText>{subcat.description}</TranslatableText>
                      </p>
                    )}
                    <Link href={`/${subcat.slug || subcat.name.en.toLowerCase().replace(/\s+/g, '-')}`}>
                      <Button variant="outline" className="w-full">
                        <TranslatableText>{{ en: 'View Subcategory', el: 'Προβολή Υποκατηγορίας' }}</TranslatableText>
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Category Pages */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          <TranslatableText>{{ en: 'Pages in this Category', el: 'Σελίδες σε αυτή την Κατηγορία' }}</TranslatableText>
        </h2>
        
        {pages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page, index) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <TranslatableText>{page.title}</TranslatableText>
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(page.lastUpdated).toLocaleDateString(
                          currentLang === 'el' ? 'el-GR' : 'en-US'
                        )}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    {page.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        <TranslatableText>{page.excerpt}</TranslatableText>
                      </p>
                    )}
                    <Link href={`/${categorySlug}/${page.slug}`}>
                      <Button variant="outline" className="w-full">
                        <TranslatableText>{{ en: 'Read More', el: 'Διαβάστε Περισσότερα' }}</TranslatableText>
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              <TranslatableText>{{ en: 'No pages yet', el: 'Δεν υπάρχουν ακόμα σελίδες' }}</TranslatableText>
            </h3>
            <p className="text-gray-600">
              <TranslatableText>{{ en: 'This category doesn\'t have any pages yet.', el: 'Αυτή η κατηγορία δεν έχει ακόμα σελίδες.' }}</TranslatableText>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
