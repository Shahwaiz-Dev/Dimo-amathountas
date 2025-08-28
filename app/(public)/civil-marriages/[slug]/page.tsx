import { getMunicipalityPage } from '@/lib/firestore';
import { MunicipalityPageContent } from '@/components/municipality/municipality-page-content';
import { notFound } from 'next/navigation';

interface CivilMarriagesPageProps {
  params: {
    slug: string;
  };
}

export default async function CivilMarriagesPage({ params }: CivilMarriagesPageProps) {
  const page = await getMunicipalityPage(params.slug);
  
  if (!page || !page.isPublished || page.category !== 'civil-marriages') {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MunicipalityPageContent pageData={page} />
    </div>
  );
} 