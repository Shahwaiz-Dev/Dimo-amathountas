'use client';

import { Hero } from '@/components/home/hero';
import { FeaturedNews } from '@/components/home/featured-news';
import { UpcomingEvents } from '@/components/home/upcoming-events';
import { MuseumsSection } from '@/components/home/museums-section';
import { ExploreTown } from '@/components/home/explore-town';
import { motion, easeOut } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

const sectionVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
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

export default function Home() {
  return (
    <motion.div 
      className="min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <main>
        <motion.div variants={sectionVariants}>
          <Hero />
        </motion.div>
        <motion.div variants={sectionVariants}>
          <ExploreTown />
        </motion.div>
        <motion.div variants={sectionVariants}>
          <FeaturedNews />
        </motion.div>
        <motion.div variants={sectionVariants}>
          <UpcomingEvents />
        </motion.div>
        <motion.div variants={sectionVariants}>
          <MuseumsSection />
        </motion.div>
      </main>
    </motion.div>
  );
} 