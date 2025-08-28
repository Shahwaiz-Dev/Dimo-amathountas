'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { TranslatableText } from '@/components/translatable-content';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock } from 'lucide-react';

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-white">
      {/* Scroll to top button */}
      <motion.button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 p-3 bg-primary hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronUp className="h-5 w-5" />
      </motion.button>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={60} 
                height={60} 
                className="rounded-full mr-3"
              />
              <div>
                <h3 className="text-xl font-bold">
                  <TranslatableText>Agios Athanasios</TranslatableText>
                </h3>
                <p className="text-slate-400 text-sm">
                  <TranslatableText>Municipality</TranslatableText>
                </p>
              </div>
            </div>
            <p className="text-slate-300 mb-4">
              <TranslatableText>
                Serving our community with dedication and excellence. 
                Discover the beauty and history of Agios Athanasios.
              </TranslatableText>
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                className="text-slate-400 hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Facebook className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                className="text-slate-400 hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                className="text-slate-400 hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              <TranslatableText>Quick Links</TranslatableText>
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-300 hover:text-primary transition-colors">
                  <TranslatableText>Home</TranslatableText>
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-slate-300 hover:text-primary transition-colors">
                  <TranslatableText>News</TranslatableText>
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-slate-300 hover:text-primary transition-colors">
                  <TranslatableText>Events</TranslatableText>
                </Link>
              </li>
              <li>
                <Link href="/museums" className="text-slate-300 hover:text-primary transition-colors">
                  <TranslatableText>Museums</TranslatableText>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-primary transition-colors">
                  <TranslatableText>Contact</TranslatableText>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              <TranslatableText>Services</TranslatableText>
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/municipality" className="text-slate-300 hover:text-primary transition-colors">
                  <TranslatableText>Municipality</TranslatableText>
                </Link>
              </li>
              <li>
                <Link href="/citizen-services" className="text-slate-300 hover:text-primary transition-colors">
                  <TranslatableText>Citizen Services</TranslatableText>
                </Link>
              </li>
              <li>
                <Link href="/civil-marriages" className="text-slate-300 hover:text-primary transition-colors">
                  <TranslatableText>Civil Marriages</TranslatableText>
                </Link>
              </li>
              <li>
                <Link href="/permits" className="text-slate-300 hover:text-primary transition-colors">
                  <TranslatableText>Permits & Licenses</TranslatableText>
                </Link>
              </li>
              <li>
                <Link href="/complaints" className="text-slate-300 hover:text-primary transition-colors">
                  <TranslatableText>Complaints</TranslatableText>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              <TranslatableText>Contact Info</TranslatableText>
            </h4>
            <div className="space-y-3">
              <div className="flex items-center text-slate-300">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                <span className="text-sm">
                  <TranslatableText>Agios Athanasios, Limassol, Cyprus</TranslatableText>
                </span>
              </div>
              <div className="flex items-center text-slate-300">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                <a href="tel:25864100" className="text-sm hover:text-primary transition-colors">
                  25864100
                </a>
              </div>
              <div className="flex items-center text-slate-300">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                <a href="mailto:municipality@amathounta.org.cy" className="text-sm hover:text-primary transition-colors">
                  municipality@amathounta.org.cy
                </a>
              </div>
              <div className="flex items-center text-slate-300">
                <Clock className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                <span className="text-sm">
                  <TranslatableText>Mon-Fri: 07:30-15:00</TranslatableText>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} <TranslatableText>Agios Athanasios Municipality</TranslatableText>. 
            <TranslatableText>All rights reserved.</TranslatableText>
          </p>
        </div>
      </div>
    </footer>
  );
}