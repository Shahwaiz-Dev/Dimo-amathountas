import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { TranslationProvider } from '@/hooks/useTranslation';
import { Toaster } from 'sonner';
import { InitialLoader } from '@/components/ui/initial-loader';
import { AdminLayout } from '@/components/admin/admin-layout';
import ErrorBoundary from '@/components/ui/error-boundary';
import { CookieConsent } from '@/components/ui/cookie-consent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Agios Athanasios Municipality',
  description: 'Official website of Agios Athanasios Municipality',
  keywords: 'municipality, government, services, Cyprus, Agios Athanasios',
  authors: [{ name: 'Agios Athanasios Municipality' }],
  creator: 'Agios Athanasios Municipality',
  publisher: 'Agios Athanasios Municipality',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://amathounta.org.cy'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Agios Athanasios Municipality',
    description: 'Official website of Agios Athanasios Municipality',
    url: 'https://amathounta.org.cy',
    siteName: 'Agios Athanasios Municipality',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Agios Athanasios Municipality',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agios Athanasios Municipality',
    description: 'Official website of Agios Athanasios Municipality',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <TranslationProvider>
            <InitialLoader />
            {children}
            <Toaster />
            <CookieConsent />
          </TranslationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}