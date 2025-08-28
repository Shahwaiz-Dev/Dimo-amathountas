'use client';

import Image from 'next/image';
import { TranslatableContent } from '@/components/translatable-content';
import { motion, easeOut } from 'framer-motion';

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
    y: 30,
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

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easeOut
    }
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: easeOut
    }
  }
};

export default function AboutPage() {
  return (
    <motion.div 
      className="min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <main className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-card rounded-2xl shadow-lg p-8"
            variants={sectionVariants}
          >
            {/* Left: Image */}
            <motion.div 
              className="flex justify-center md:justify-end"
              variants={sectionVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                  alt="Amathountas"
                  width={400}
                  height={400}
                  className="rounded-2xl shadow-xl object-cover w-full max-w-xs md:max-w-sm lg:max-w-md"
                  priority
                />
              </motion.div>
            </motion.div>
            
            {/* Right: Content */}
            <motion.div 
              className="space-y-8"
              variants={sectionVariants}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <TranslatableContent 
                  title={{ en: "About Us", el: "Σχετικά με εμάς" }}
                  content={{ en: "Welcome to Amathountas! We are dedicated to serving our community with transparency, innovation, and care. Our municipality is committed to providing excellent services and fostering a vibrant, inclusive environment for all residents.", el: "Καλώς ήρθατε στον Άγιο Αθανάσιο! Είμαστε αφοσιωμένοι στην εξυπηρέτηση της κοινότητάς μας με διαφάνεια, καινοτομία και φροντίδα. Ο δήμος μας δεσμεύεται να παρέχει άριστες υπηρεσίες και να προάγει ένα ζωντανό, συμπεριληπτικό περιβάλλον για όλους τους κατοίκους." }}
                  className="mb-4"
                />
              </motion.div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <motion.div 
                  className="flex items-start gap-4 p-4 bg-card rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <motion.span 
                    className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary text-2xl"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                    </svg>
                  </motion.span>
                  <div>
                    <TranslatableContent 
                      title={{ en: "Transparency", el: "Διαφάνεια" }}
                      content={{ en: "Open communication and clear processes for all residents.", el: "Ανοιχτή επικοινωνία και διαφανείς διαδικασίες για όλους τους κατοίκους." }}
                      className=""
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start gap-4 p-4 bg-card rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <motion.span 
                    className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary text-2xl"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L19.5 12m0 0l-6 7.5M19.5 12H4.5" />
                    </svg>
                  </motion.span>
                  <div>
                    <TranslatableContent 
                      title={{ en: "Innovation", el: "Καινοτομία" }}
                      content={{ en: "Modern solutions and technology for a better future.", el: "Σύγχρονες λύσεις και τεχνολογία για ένα καλύτερο μέλλον." }}
                      className=""
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start gap-4 p-4 bg-card rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <motion.span 
                    className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary text-2xl"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </motion.span>
                  <div>
                    <TranslatableContent 
                      title={{ en: "Inclusivity", el: "Συμπερίληψη" }}
                      content={{ en: "A welcoming environment for all backgrounds and ages.", el: "Ένα φιλόξενο περιβάλλον για όλα τα υπόβαθρα και τις ηλικίες." }}
                      className=""
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start gap-4 p-4 bg-card rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <motion.span 
                    className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary text-2xl"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                    </svg>
                  </motion.span>
                  <div>
                    <TranslatableContent 
                      title={{ en: "Service", el: "Εξυπηρέτηση" }}
                      content={{ en: "Dedicated to providing excellent municipal services.", el: "Αφοσιωμένοι στην παροχή άριστων δημοτικών υπηρεσιών." }}
                      className=""
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
}