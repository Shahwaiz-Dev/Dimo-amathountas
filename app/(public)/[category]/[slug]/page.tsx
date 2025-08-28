'use client';

import { getMunicipalityPage, getPageCategories } from '@/lib/firestore';
import { MunicipalityPageContent } from '@/components/municipality/municipality-page-content';
import { notFound } from 'next/navigation';
import { motion, easeOut } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DynamicPageProps {
  params: {
    category: string;
    slug: string;
  };
}

const pageVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut
    }
  }
};

export default function DynamicPage({ params }: DynamicPageProps) {
  const { category, slug } = params;
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      try {
        // First, try to get the page directly
        const pageData = await getMunicipalityPage(slug);
        
        if (!pageData || !pageData.isPublished) {
          notFound();
        }

        // Check if this page belongs to the requested category
        const pageCategory = pageData.category;
        
        // For hardcoded categories, check exact match
        if (pageCategory === category) {
          setPage(pageData);
          return;
        }

        // For dynamic categories, we need to check if the category name matches the URL
        // Get all categories to find the matching one
        const categories = await getPageCategories();
        const matchingCategory = categories.find(cat => {
          const categoryName = cat.name.en.toLowerCase().replace(/\s+/g, '-');
          return categoryName === category;
        });

        if (matchingCategory && pageCategory === matchingCategory.id) {
          setPage(pageData);
          return;
        }

        // If no match found, show 404
        notFound();
      } catch (error) {
        console.error('Error loading dynamic page:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    loadPage();
  }, [category, slug]);

  if (loading) {
    return (
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <motion.div 
            className="mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-lg text-gray-600">Loading page...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <MunicipalityPageContent pageData={page} />
    </motion.div>
  );
} 