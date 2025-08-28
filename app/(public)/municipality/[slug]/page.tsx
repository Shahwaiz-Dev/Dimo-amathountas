import { notFound } from 'next/navigation';
import { getMunicipalityPage } from '@/lib/firestore';
import { MunicipalityPageContent } from '@/components/municipality/municipality-page-content';

interface MunicipalityPageProps {
  params: {
    slug: string;
  };
}

export default async function MunicipalityPage({ params }: MunicipalityPageProps) {
  const { slug } = params;
  
  try {
    const pageData = await getMunicipalityPage(slug);
    
    if (!pageData || !pageData.isPublished) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <MunicipalityPageContent pageData={pageData} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching municipality page:', error);
    notFound();
  }
} 