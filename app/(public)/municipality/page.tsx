import { getAllMunicipalityPages } from '@/lib/firestore';
import { MunicipalityIndex } from '@/components/municipality/municipality-index';

export default async function MunicipalityIndexPage() {
  const allPages = await getAllMunicipalityPages();
  // Only show published pages
  const pages = allPages.filter(page => page.isPublished);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <MunicipalityIndex pages={pages} />
    </div>
  );
} 