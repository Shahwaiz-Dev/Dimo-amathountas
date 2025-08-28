'use client';

import { getMunicipalityPage } from '@/lib/firestore';
import { MunicipalityPageContent } from '@/components/municipality/municipality-page-content';
import { notFound } from 'next/navigation';
import { motion, easeOut } from 'framer-motion';
import { HeartbeatLoader } from '@/components/ui/heartbeat-loader';
import { useEffect, useState } from 'react';

interface ServicesPageProps {
  params: {
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

export default function ServicesPage({ params }: ServicesPageProps) {
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const pageData = await getMunicipalityPage(params.slug);
        if (!pageData || !pageData.isPublished || pageData.category !== 'services') {
          notFound();
        }
        setPage(pageData);
      } catch (error) {
        console.error('Error loading page:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    loadPage();
  }, [params.slug]);

  if (loading) {
    return (
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
                      <motion.div 
              className="mx-auto mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <HeartbeatLoader size="lg" />
            </motion.div>
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