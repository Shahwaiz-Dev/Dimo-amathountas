import { fetchMuseums, getMuseumById } from '@/lib/firestore';
import { MuseumDetail } from '@/components/museums/MuseumDetail';

export async function generateStaticParams() {
  const museums = await fetchMuseums();
  return museums.map((museum) => ({
    id: museum.id,
  }));
}

export default async function MuseumDetailPage({ params }: { params: { id: string } }) {
  const museum: any = await getMuseumById(params.id);
  const allMuseums: any[] = await fetchMuseums();

  if (!museum) {
    return <div className="max-w-3xl mx-auto py-8 px-4">Museum not found.</div>;
  }

  // Exclude current museum from related museums
  const relatedMuseums = allMuseums.filter((item) => item.id !== museum.id && item.published).slice(0, 2);

  return <MuseumDetail museum={museum} relatedMuseums={relatedMuseums} />;
} 