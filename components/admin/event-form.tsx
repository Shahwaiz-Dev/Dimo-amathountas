'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { addEvent, updateEvent } from '@/lib/firestore';
import { toast } from 'sonner';
import { TranslatableText } from '@/components/translatable-content';
import { ImageUpload } from '@/components/ui/image-upload';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-48 bg-gray-100 rounded animate-pulse" />
});

interface EventFormProps {
  event?: any;
  onClose: () => void;
}

interface FormData {
  title: {
    en: string;
    el: string;
  };
  description: {
    en: string;
    el: string;
  };
  location: {
    en: string;
    el: string;
  };
  date: string;
  time: string;
  endTime: string;
  imageUrl: string;
  link: string;
  published: boolean;
  featured: boolean;
  category: string;
  publishDate: string; // ISO string
}

export function EventForm({ event, onClose }: EventFormProps) {
  const [loading, setLoading] = useState(false);
  // Helper function to safely extract text from multilingual objects
  const getTextFromMultilingual = (text: any): string => {
    if (typeof text === 'string') {
      return text;
    }
    if (text && typeof text === 'object' && 'en' in text) {
      return text.en || '';
    }
    return '';
  };

  const [formData, setFormData] = useState<FormData>({
    title: {
      en: getTextFromMultilingual(event?.title),
      el: event?.title?.el || ''
    },
    description: {
      en: getTextFromMultilingual(event?.description),
      el: event?.description?.el || ''
    },
    location: {
      en: getTextFromMultilingual(event?.location),
      el: event?.location?.el || ''
    },
    date: event?.date?.seconds ? new Date(event.date.seconds * 1000).toISOString().split('T')[0] : event?.date || '',
    time: getTextFromMultilingual(event?.time) || '',
    endTime: getTextFromMultilingual(event?.endTime) || '',
    imageUrl: getTextFromMultilingual(event?.imageUrl) || '',
    link: getTextFromMultilingual(event?.link) || '',
    published: event?.published ?? false,
    featured: event?.featured ?? false,
    category: getTextFromMultilingual(event?.category) || 'General',
    publishDate: event?.publishDate
      ? (typeof event.publishDate === 'string' ? event.publishDate : (event.publishDate.seconds ? new Date(event.publishDate.seconds * 1000).toISOString().slice(0, 16) : ''))
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
      if (event) {
        await updateEvent(event.id, dataToSave);
        toast.success('Event updated successfully');
      } else {
        await addEvent(dataToSave);
        toast.success('Event created successfully');
      }
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Error saving event');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMultilingualChange = (field: keyof Pick<FormData, 'title' | 'description' | 'location'>, lang: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...(prev[field] as { en: string; el: string }),
        [lang]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onClose} disabled={loading} className="border-primary text-primary hover:bg-primary hover:text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <TranslatableText>Back to Events</TranslatableText>
        </Button>
        <h1 className="text-2xl font-bold">
          {event ? (
            <TranslatableText>Edit Event</TranslatableText>
          ) : (
            <TranslatableText>Create Event</TranslatableText>
          )}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <TranslatableText>Event Details</TranslatableText>
          </CardTitle>
          <CardDescription>
            {event ? (
              <TranslatableText>Update the event information</TranslatableText>
            ) : (
              <TranslatableText>Enter the event information</TranslatableText>
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

            {/* Description Section */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                <TranslatableText>Description</TranslatableText>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">English</Label>
                  <div className="bg-white rounded shadow-sm">
                    <ReactQuill
                      value={formData.description.en}
                      onChange={(value) => handleMultilingualChange('description', 'en', value)}
                      theme="snow"
                      readOnly={loading}
                      style={{ minHeight: 200 }}
                      placeholder="Enter description in English"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Greek</Label>
                  <div className="bg-white rounded shadow-sm">
                    <ReactQuill
                      value={formData.description.el}
                      onChange={(value) => handleMultilingualChange('description', 'el', value)}
                      theme="snow"
                      readOnly={loading}
                      style={{ minHeight: 200 }}
                      placeholder="Εισάγετε περιγραφή στα ελληνικά"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                <TranslatableText>Location</TranslatableText>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location-en" className="text-sm text-gray-600">English</Label>
                  <Input
                    id="location-en"
                    value={formData.location.en}
                    onChange={(e) => handleMultilingualChange('location', 'en', e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter location in English"
                  />
                </div>
                <div>
                  <Label htmlFor="location-el" className="text-sm text-gray-600">Greek</Label>
                  <Input
                    id="location-el"
                    value={formData.location.el}
                    onChange={(e) => handleMultilingualChange('location', 'el', e.target.value)}
                    disabled={loading}
                    placeholder="Εισάγετε τοποθεσία στα ελληνικά"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">
                  <TranslatableText>Date</TranslatableText>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="time">
                  <TranslatableText>Time</TranslatableText>
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="endTime">
                <TranslatableText>End Time (optional)</TranslatableText>
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                disabled={loading}
              />
            </div>

            <ImageUpload
              value={formData.imageUrl}
              onChange={(url) => handleChange('imageUrl', url)}
              disabled={loading}
              folder="events"
              label="Event Image"
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
                ) : event ? (
                  <TranslatableText>Update Event</TranslatableText>
                ) : (
                  <TranslatableText>Create Event</TranslatableText>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}