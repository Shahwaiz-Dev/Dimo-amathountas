import { fetchNews, getNewsById } from '@/lib/firestore';
import { NewsDetail } from '@/components/news/NewsDetail';

export async function generateStaticParams() {
  const news = await fetchNews();
  return news.map((item: any) => ({ id: item.id }));
}

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const news: any = await getNewsById(params.id);
  const allNews: any[] = await fetchNews();

  if (!news) {
    return <div className="max-w-3xl mx-auto py-8 px-4">News article not found.</div>;
  }

  // Exclude current article from recent news
  const recentNews = allNews.filter((item) => item.id !== news.id).slice(0, 3);

  return <NewsDetail news={news} recentNews={recentNews} />;
} 