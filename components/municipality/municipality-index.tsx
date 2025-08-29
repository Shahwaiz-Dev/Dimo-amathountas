'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  User, 
  Users, 
  FileText, 
  Heart, 
  ArrowRight,
  Calendar 
} from 'lucide-react';
import Link from 'next/link';
import { MunicipalityPage } from '@/lib/firestore';

interface MunicipalityIndexProps {
  pages: MunicipalityPage[];
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'vision-mission':
      return <Building className="h-8 w-8" />;
    case 'mayor':
      return <User className="h-8 w-8" />;
    case 'administration':
    case 'municipal-council':
    case 'municipal-committees':
      return <Users className="h-8 w-8" />;
    case 'decisions':
      return <FileText className="h-8 w-8" />;
    case 'services-structure':
      return <Building className="h-8 w-8" />;
    case 'social-programs':
      return <Heart className="h-8 w-8" />;
    default:
      return <Building className="h-8 w-8" />;
  }
};

const getCategoryLabel = (category: string) => {
  const labels = {
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

export function MunicipalityIndex({ pages }: MunicipalityIndexProps) {
  const { currentLang } = useTranslation();

  const getBilingualContent = (content: { en: string; el: string }) => {
    return currentLang === 'el' ? content.el : content.en;
  };

  const getBilingualTitle = (title: { en: string; el: string }) => {
    return currentLang === 'el' ? title.el : title.en;
  };

  // Filter only published pages
  const publishedPages = pages.filter(page => page.isPublished);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {currentLang === 'el' ? 'Δήμος' : 'Municipality'}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {currentLang === 'el' 
            ? 'Εξερευνήστε τις πληροφορίες για τον Δήμο μας, τη διοίκηση, τις υπηρεσίες και τα προγράμματα.'
            : 'Explore information about our Municipality, administration, services, and programs.'
          }
        </p>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishedPages.map((page) => {
          return (
            <Card key={page.id} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-primary">
                    {getCategoryIcon(page.category)}
                  </div>
                </div>
                
                <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {getBilingualTitle(page.title)}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                {page.excerpt && (
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {getBilingualContent(page.excerpt)}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(page.lastUpdated).toLocaleDateString(
                        currentLang === 'el' ? 'el-GR' : 'en-US',
                        { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        }
                      )}
                    </span>
                  </div>
                  
                  <Link href={`/municipality/${page.slug}`}>
                    <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-white transition-colors">
                      {currentLang === 'el' ? 'Δείτε περισσότερα' : 'Read More'}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {publishedPages.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {currentLang === 'el' ? 'Δεν βρέθηκαν σελίδες' : 'No pages found'}
            </h3>
            <p className="text-muted-foreground">
              {currentLang === 'el' 
                ? 'Οι σελίδες του δήμου θα εμφανιστούν εδώ μόλις προστεθούν.'
                : 'Municipality pages will appear here once they are added.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 