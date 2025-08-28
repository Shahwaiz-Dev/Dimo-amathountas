import { getMunicipalityPage } from '@/lib/firestore';
import { MunicipalityPageContent } from '@/components/municipality/municipality-page-content';
import { notFound } from 'next/navigation';

interface CitizenServicesPageProps {
  params: {
    slug: string;
  };
}

export default async function CitizenServicesPage({ params }: CitizenServicesPageProps) {
  console.log('Looking for page with slug:', params.slug);
  
  const page = await getMunicipalityPage(params.slug);
  
  console.log('Found page:', page);
  
  if (!page) {
    console.log('Page not found');
    notFound();
  }
  
  if (!page.isPublished) {
    console.log('Page not published');
    notFound();
  }
  
  console.log('Page category:', page.category);
  console.log('Page is published:', page.isPublished);

  return (
    <div className="container mx-auto px-4 py-8">
      <MunicipalityPageContent pageData={page} />
    </div>
  );
} 