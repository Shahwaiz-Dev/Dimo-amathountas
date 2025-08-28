import { CategoryLanding } from '@/components/category/category-landing';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return <CategoryLanding categorySlug={params.category} />;
}
