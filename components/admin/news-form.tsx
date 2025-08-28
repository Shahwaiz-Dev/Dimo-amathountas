'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { addNews, updateNews } from '@/lib/firestore';
import { toast } from 'sonner';
import { TranslatableText } from '@/components/translatable-content';
import { ImageUpload } from '@/components/ui/image-upload';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-48 bg-gray-100 rounded animate-pulse" />
});

interface NewsFormProps {
  news?: any;
  onClose: () => void;
}

interface MultilingualField {
  en: string;
  el: string;
}

interface NewsFormData {
  title: MultilingualField;
  excerpt: MultilingualField;
  content: MultilingualField;
  imageUrl: string;
  link: string;
  published: boolean;
  featured: boolean;
  category: string;
  publishDate: string; // ISO string
}

type MultilingualFieldKey = 'title' | 'excerpt' | 'content';

export function NewsForm({ news, onClose }: NewsFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<NewsFormData>({
    title: {
      en: news?.title?.en || news?.title || '',
      el: news?.title?.el || ''
    },
    excerpt: {
      en: news?.excerpt?.en || news?.excerpt || '',
      el: news?.excerpt?.el || ''
    },
    content: {
      en: news?.content?.en || news?.content || '',
      el: news?.content?.el || ''
    },
    imageUrl: news?.imageUrl || '',
    link: news?.link || '',
    published: news?.published ?? false,
    featured: news?.featured ?? false,
    category: news?.category || 'General',
    publishDate: news?.publishDate
      ? (typeof news.publishDate === 'string' ? news.publishDate : (news.publishDate.seconds ? new Date(news.publishDate.seconds * 1000).toISOString().slice(0, 16) : ''))
      : new Date().toISOString().slice(0, 16),
  });

  // Auto-publish when scheduled time arrives (client-side simulation, fixed)
  useEffect(() => {
    const now = new Date();
    const publishDateObj = new Date(formData.publishDate);
    // Only set up timer if not published and publish date is in the future
    if (!formData.published && publishDateObj > now) {
      const timeout = setTimeout(() => {
        setFormData(prev => ({ ...prev, published: true }));
      }, publishDateObj.getTime() - now.getTime());
      return () => clearTimeout(timeout);
    }
    // Do nothing if already published or publish date is now/past
    return;
  }, [formData.publishDate, formData.published]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // If publishDate is in the past, show error and return
    const now = new Date();
    const publishDateObj = new Date(formData.publishDate);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
    
    if (publishDateObj < oneDayAgo) {
      toast.error('Publish date cannot be more than 24 hours in the past.');
      setLoading(false);
      return;
    }
    // If publishDate is in the future, force published to false
    const isFuture = publishDateObj > now;
    const dataToSave = {
      ...formData,
      published: isFuture ? false : formData.published,
      featured: formData.featured,
      publishDate: formData.publishDate,
    };

    try {
      if (news) {
        await updateNews(news.id, dataToSave);
        toast.success('News article updated successfully');
      } else {
        await addNews(dataToSave);
        toast.success('News article created successfully');
      }
      onClose();
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Error saving news article');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof NewsFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMultilingualChange = (field: MultilingualFieldKey, lang: 'en' | 'el', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...(prev[field] as MultilingualField),
        [lang]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onClose} disabled={loading} className="border-primary text-primary hover:bg-primary hover:text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <TranslatableText>Back to News</TranslatableText>
        </Button>
        <h1 className="text-2xl font-bold">
          {news ? (
            <TranslatableText>Edit News Article</TranslatableText>
          ) : (
            <TranslatableText>Create News Article</TranslatableText>
          )}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <TranslatableText>Article Details</TranslatableText>
          </CardTitle>
          <CardDescription>
            {news ? (
              <TranslatableText>Update the news article information</TranslatableText>
            ) : (
              <TranslatableText>Enter the news article information</TranslatableText>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Section */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                <TranslatableText>Title</TranslatableText>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title-en" className="text-sm text-gray-600">English</Label>
                  <Input
                    id="title-en"
                    value={formData.title.en}
                    onChange={(e) => handleMultilingualChange('title', 'en', e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter title in English"
                  />
                </div>
                <div>
                  <Label htmlFor="title-el" className="text-sm text-gray-600">Greek</Label>
                  <Input
                    id="title-el"
                    value={formData.title.el}
                    onChange={(e) => handleMultilingualChange('title', 'el', e.target.value)}
                    disabled={loading}
                    placeholder="Εισάγετε τίτλο στα ελληνικά"
                  />
                </div>
              </div>
            </div>

            {/* Excerpt Section */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                <TranslatableText>Excerpt</TranslatableText>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="excerpt-en" className="text-sm text-gray-600">English</Label>
                  <Textarea
                    id="excerpt-en"
                    value={formData.excerpt.en}
                    onChange={(e) => handleMultilingualChange('excerpt', 'en', e.target.value)}
                    rows={3}
                    required
                    disabled={loading}
                    placeholder="Enter excerpt in English"
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt-el" className="text-sm text-gray-600">Greek</Label>
                  <Textarea
                    id="excerpt-el"
                    value={formData.excerpt.el}
                    onChange={(e) => handleMultilingualChange('excerpt', 'el', e.target.value)}
                    rows={3}
                    disabled={loading}
                    placeholder="Εισάγετε περίληψη στα ελληνικά"
                  />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                <TranslatableText>Content</TranslatableText>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">English</Label>
                  <div className="bg-white rounded shadow-sm">
                    <ReactQuill
                      value={formData.content.en}
                      onChange={(value) => handleMultilingualChange('content', 'en', value)}
                      theme="snow"
                      readOnly={loading}
                      style={{ minHeight: 200 }}
                      placeholder="Enter content in English"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Greek</Label>
                  <div className="bg-white rounded shadow-sm">
                    <ReactQuill
                      value={formData.content.el}
                      onChange={(value) => handleMultilingualChange('content', 'el', value)}
                      theme="snow"
                      readOnly={loading}
                      style={{ minHeight: 200 }}
                      placeholder="Εισάγετε περιεχόμενο στα ελληνικά"
                    />
                  </div>
                </div>
              </div>
            </div>

            <ImageUpload
              value={formData.imageUrl}
              onChange={(url) => handleChange('imageUrl', url)}
              disabled={loading}
              folder="news"
              label="Article Image"
            />

            <div>
              <Label htmlFor="link">
                <TranslatableText>External Link (optional)</TranslatableText>
              </Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => handleChange('link', e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="category">
                <TranslatableText>Category</TranslatableText>
              </Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Publish Date Picker */}
            {!formData.published && (
              <div>
                <Label htmlFor="publishDate">
                  <TranslatableText>Publish Date & Time</TranslatableText>
                </Label>
                <Input
                  id="publishDate"
                  type="datetime-local"
                  value={formData.publishDate}
                  onChange={e => handleChange('publishDate', e.target.value)}
                  disabled={loading}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            )}

            {/* Scheduled Status Badge */}
            {!formData.published && (() => {
              const now = new Date();
              const publishDateObj = new Date(formData.publishDate);
              if (publishDateObj > now) {
                return (
                  <div className="mb-2">
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-semibold">
                      <TranslatableText>Scheduled</TranslatableText>: {publishDateObj.toLocaleString()}
                    </span>
                  </div>
                );
              }
              return null;
            })()}

            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => handleChange('published', checked)}
                  disabled={loading}
                />
                <Label htmlFor="published">
                  <TranslatableText>Published</TranslatableText>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleChange('featured', checked)}
                  disabled={loading}
                />
                <Label htmlFor="featured">
                  <TranslatableText>Featured</TranslatableText>
                </Label>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                <TranslatableText>Cancel</TranslatableText>
              </Button>
              <Button type="submit" disabled={loading} className="bg-primary text-white">
                <Save className="h-4 w-4 mr-2" />
                {loading ? (
                  <TranslatableText>Saving...</TranslatableText>
                ) : news ? (
                  <TranslatableText>Update Article</TranslatableText>
                ) : (
                  <TranslatableText>Create Article</TranslatableText>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}