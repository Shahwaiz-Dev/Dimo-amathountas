import { notFound } from 'next/navigation';
import { getMunicipalityPage } from '@/lib/firestore';
import { MunicipalityPageContent } from '@/components/municipality/municipality-page-content';

interface CategoryPageProps {
  params: {
    category: string;
    slug: string;
  };
}

export default async function CategorySlugPage({ params }: CategoryPageProps) {
  const { slug } = params;

  // Get the page by slug
  const page = await getMunicipalityPage(slug);
  
  if (!page) {
    notFound();
  }
  
  if (!page.isPublished) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MunicipalityPageContent pageData={page} />
    </div>
  );
}
