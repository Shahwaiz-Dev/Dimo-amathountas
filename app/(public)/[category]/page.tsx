import { notFound } from 'next/navigation';
import { CategoryLanding } from '@/components/category/category-landing';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;

  // Validate that we have a category parameter
  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryLanding categorySlug={category} />
    </div>
  );
}
