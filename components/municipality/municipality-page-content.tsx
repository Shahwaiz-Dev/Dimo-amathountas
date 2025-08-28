'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { TranslatableText } from '@/components/translatable-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, User, Users, FileText, Building, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllMunicipalityPages, MunicipalityPage } from '@/lib/firestore';
import Image from 'next/image';

interface MunicipalityPageContentProps {
  pageData?: MunicipalityPage;
}

const getPageIcon = (slug: string) => {
  switch (slug) {
    case 'vision-mission':
      return <Building className="h-6 w-6" />;
    case 'mayor':
      return <User className="h-6 w-6" />;
    case 'administration':
      return <Users className="h-6 w-6" />;
    case 'municipal-council':
      return <Users className="h-6 w-6" />;
    case 'municipal-committees':
      return <Users className="h-6 w-6" />;
    case 'decisions':
      return <FileText className="h-6 w-6" />;
    case 'services-structure':
      return <Building className="h-6 w-6" />;
    case 'social-programs':
      return <Heart className="h-6 w-6" />;
    default:
      return <Building className="h-6 w-6" />;
  }
};

const getCategoryLabel = (category: string) => {
  const labels = {
    'municipality': { en: 'Municipality', el: 'Δήμος' },
    'citizen-services': { en: 'Citizen Services', el: 'Υπηρεσίες Πολιτών' },
    'services': { en: 'Services', el: 'Υπηρεσίες' },
    'civil-marriages': { en: 'Civil Marriages', el: 'Πολιτικοί Γάμοι' },
    'vision-mission': { en: 'Vision & Mission', el: 'Όραμα & Αποστολή' },
    'mayor': { en: 'Mayor', el: 'Δήμαρχος' },
    'administration': { en: 'Administration', el: 'Διοίκηση' },
    'municipal-council': { en: 'Municipal Council', el: 'Δημοτικό Συμβούλιο' },
    'municipal-committees': { en: 'Municipal Committees', el: 'Δημοτικές Επιτροπές' },
    'decisions': { en: 'Decisions', el: 'Αποφάσεις' },
    'services-structure': { en: 'Services Structure', el: 'Δομή Υπηρεσιών' },
    'social-programs': { en: 'Social Programs', el: 'Κοινωνικά Προγράμματα' }
  };
  return labels[category as keyof typeof labels] || { en: category, el: category };
};

export function MunicipalityPageContent({ pageData }: MunicipalityPageContentProps) {
  const { currentLang } = useTranslation();
  const [relatedPages, setRelatedPages] = useState<MunicipalityPage[]>([]);
  
  const getBilingualContent = (content: { en: string; el: string }) => {
    return currentLang === 'el' ? content.el : content.en;
  };

  const getBilingualTitle = (title: { en: string; el: string }) => {
    return currentLang === 'el' ? title.el : title.en;
  };

  // Fetch related pages
  useEffect(() => {
    if (!pageData?.slug) return; // Don't load if pageData is not available
    
    const loadRelatedPages = async () => {
      try {
        const allPages = await getAllMunicipalityPages();
        // Filter out current page and only show published pages
        const filteredPages = allPages
          .filter(page => page.slug !== pageData.slug && page.isPublished)
          .slice(0, 4); // Show max 4 related pages
        setRelatedPages(filteredPages);
      } catch (error) {
        console.error('Error loading related pages:', error);
      }
    };

    loadRelatedPages();
  }, [pageData?.slug]);

  // Don't render if pageData is not available
  if (!pageData) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FileText className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Loading page...</h3>
            <p className="text-gray-500">Please wait while we load the page content.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categoryLabel = getCategoryLabel(pageData.category);

  // Function to get the correct route for a page based on its category
  const getPageRoute = (page: MunicipalityPage) => {
    switch (page.category) {
      case 'municipality':
        return `/municipality/${page.slug}`;
      case 'services':
        return `/services/${page.slug}`;
      case 'citizen-services':
        return `/citizen-services/${page.slug}`;
      case 'civil-marriages':
        return `/civil-marriages/${page.slug}`;
      default:
        return `/municipality/${page.slug}`;
    }
  };

  // Layout rendering logic
  const layout = pageData.layout || 'layout1';

  if (layout === 'layout2') {
    // Sidebar + Content
    return (
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                {currentLang === 'el' ? 'Πληροφορίες Σελίδας' : 'Page Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">
                  {currentLang === 'el' ? 'Κατηγορία' : 'Category'}
                </h4>
                <p className="text-sm">{getBilingualTitle(categoryLabel)}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">
                  {currentLang === 'el' ? 'Τελευταία Ενημέρωση' : 'Last Updated'}
                </h4>
                <p className="text-sm">
                  {new Date(pageData.lastUpdated).toLocaleDateString(
                    currentLang === 'el' ? 'el-GR' : 'en-US',
                    { year: 'numeric', month: 'short', day: 'numeric' }
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
          {/* Related Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {currentLang === 'el' ? 'Σχετικές Σελίδες' : 'Related Pages'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {relatedPages.length > 0 ? (
                <div className="space-y-2">
                  {relatedPages.map((page) => (
                    <a
                      key={page.slug}
                      href={getPageRoute(page)}
                      className="block text-sm text-primary hover:underline transition-colors"
                    >
                      {getBilingualTitle(page.title)}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {currentLang === 'el' ? 'Δεν βρέθηκαν σχετικές σελίδες' : 'No related pages found'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              {pageData.imageUrl && (
                <div className="mb-6">
                  <div className="relative w-full h-64">
                    <Image
                      src={pageData.imageUrl}
                      alt={getBilingualTitle(pageData.title)}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 100vw, 800px"
                      priority
                    />
                  </div>
                </div>
              )}
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {getBilingualTitle(pageData.title)}
              </h1>
              {pageData.excerpt && (
                <p className="text-lg text-muted-foreground mb-6">
                  {getBilingualContent(pageData.excerpt)}
                </p>
              )}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: getBilingualContent(pageData.content) 
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (layout === 'layout3') {
    // Image Banner + Content
    return (
      <div className="max-w-4xl mx-auto">
        {/* Image Banner */}
        {pageData.imageUrl && (
          <div className="mb-8">
            <div className="relative w-full h-72">
              <Image
                src={pageData.imageUrl}
                alt={getBilingualTitle(pageData.title)}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          </div>
        )}
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {getBilingualTitle(pageData.title)}
        </h1>
        {pageData.excerpt && (
          <p className="text-lg text-muted-foreground mb-6">
            {getBilingualContent(pageData.excerpt)}
          </p>
        )}
        <Card>
          <CardContent className="p-6">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: getBilingualContent(pageData.content) 
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (layout === 'layout4') {
    // Split Layout: 50% Image + 50% Content
    return (
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Image */}
          <div className="order-2 lg:order-1">
            {pageData.imageUrl ? (
              <div className="relative w-full h-96 lg:h-full min-h-[400px]">
                <Image
                  src={pageData.imageUrl}
                  alt={getBilingualTitle(pageData.title)}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-96 lg:h-full min-h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p className="text-sm">
                    {currentLang === 'el' ? 'Δεν υπάρχει εικόνα' : 'No image available'}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Side - Content */}
          <div className="order-1 lg:order-2">
            <Card className="h-full">
              <CardContent className="p-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {getBilingualTitle(pageData.title)}
                </h1>
                {pageData.excerpt && (
                  <p className="text-lg text-muted-foreground mb-6">
                    {getBilingualContent(pageData.excerpt)}
                  </p>
                )}
                
                {/* Page Info */}
                <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(pageData.lastUpdated).toLocaleDateString(
                        currentLang === 'el' ? 'el-GR' : 'en-US',
                        { year: 'numeric', month: 'short', day: 'numeric' }
                      )}
                    </span>
                  </div>
                  <Badge variant="secondary">
                    {getBilingualTitle(categoryLabel)}
                  </Badge>
                </div>
                
                <Separator className="mb-6" />
                
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: getBilingualContent(pageData.content) 
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Default: Hero + Content (Layout 1)
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <div className="mb-8 bg-blue-600 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">
          {getBilingualTitle(pageData.title)}
        </h1>
        {pageData.excerpt && (
          <p className="text-lg mb-2">
            {getBilingualContent(pageData.excerpt)}
          </p>
        )}
        {pageData.imageUrl && (
          <div className="relative w-full h-48 mt-4">
            <Image
              src={pageData.imageUrl}
              alt={getBilingualTitle(pageData.title)}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
        )}
      </div>
      <Card>
        <CardContent className="p-6">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: getBilingualContent(pageData.content) 
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
} 