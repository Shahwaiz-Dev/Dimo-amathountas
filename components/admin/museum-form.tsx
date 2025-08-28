'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { SimpleHeartbeatLoader } from '@/components/ui/heartbeat-loader';
import { addMuseum, updateMuseum } from '@/lib/firestore';
import { toast } from 'sonner';
import { TranslatableText } from '@/components/translatable-content';
import { ImageUpload } from '@/components/ui/image-upload';

interface MuseumFormProps {
  museum?: any;
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
  imageUrl: string;
  category: string;
  accessibility: boolean;
  published: boolean;
  featured: boolean;
  publishDate: string; // ISO string
}

export function MuseumForm({ museum, onClose }: MuseumFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: {
      en: museum?.title?.en || museum?.title || '',
      el: museum?.title?.el || ''
    },
    description: {
      en: museum?.description?.en || museum?.description || '',
      el: museum?.description?.el || ''
    },
    location: {
      en: museum?.location?.en || museum?.location || '',
      el: museum?.location?.el || ''
    },
    imageUrl: museum?.imageUrl || '',
    category: museum?.category || 'Museum',
    accessibility: museum?.accessibility ?? false,
    published: museum?.published ?? false,
    featured: museum?.featured ?? false,
    publishDate: museum?.publishDate
      ? (typeof museum.publishDate === 'string' ? museum.publishDate : (museum.publishDate.seconds ? new Date(museum.publishDate.seconds * 1000).toISOString().slice(0, 16) : ''))
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
      if (museum) {
        await updateMuseum(museum.id, dataToSave);
        toast.success('Museum updated successfully');
      } else {
        await addMuseum(dataToSave);
        toast.success('Museum created successfully');
      }
      onClose();
    } catch (error) {
      console.error('Error saving museum:', error);
      toast.error('Error saving museum');
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
          <TranslatableText>Back to Museums</TranslatableText>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {museum ? (
            <TranslatableText>Edit Museum</TranslatableText>
          ) : (
            <TranslatableText>Add New Museum</TranslatableText>
          )}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title-en">
              <TranslatableText>Title (English)</TranslatableText>
            </Label>
            <Input
              id="title-en"
              value={formData.title.en}
              onChange={(e) => handleMultilingualChange('title', 'en', e.target.value)}
              placeholder="Enter title in English"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title-el">
              <TranslatableText>Title (Greek)</TranslatableText>
            </Label>
            <Input
              id="title-el"
              value={formData.title.el}
              onChange={(e) => handleMultilingualChange('title', 'el', e.target.value)}
              placeholder="Enter title in Greek"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description-en">
              <TranslatableText>Description (English)</TranslatableText>
            </Label>
            <Textarea
              id="description-en"
              value={formData.description.en}
              onChange={(e) => handleMultilingualChange('description', 'en', e.target.value)}
              placeholder="Enter description in English"
              rows={4}
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description-el">
              <TranslatableText>Description (Greek)</TranslatableText>
            </Label>
            <Textarea
              id="description-el"
              value={formData.description.el}
              onChange={(e) => handleMultilingualChange('description', 'el', e.target.value)}
              placeholder="Enter description in Greek"
              rows={4}
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location-en">
              <TranslatableText>Location (English)</TranslatableText>
            </Label>
            <Input
              id="location-en"
              value={formData.location.en}
              onChange={(e) => handleMultilingualChange('location', 'en', e.target.value)}
              placeholder="Enter location in English"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location-el">
              <TranslatableText>Location (Greek)</TranslatableText>
            </Label>
            <Input
              id="location-el"
              value={formData.location.el}
              onChange={(e) => handleMultilingualChange('location', 'el', e.target.value)}
              placeholder="Enter location in Greek"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              <TranslatableText>Category</TranslatableText>
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Museum">Museum</SelectItem>
                <SelectItem value="Cultural Center">Cultural Center</SelectItem>
                <SelectItem value="Library">Library</SelectItem>
                <SelectItem value="Gallery">Gallery</SelectItem>
                <SelectItem value="Historical Site">Historical Site</SelectItem>
                <SelectItem value="Park">Park</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Publish Date Picker */}
          {!formData.published && (
            <div className="space-y-2">
              <Label htmlFor="publishDate">
                <TranslatableText>Publish Date & Time</TranslatableText>
              </Label>
              <Input
                id="publishDate"
                type="datetime-local"
                value={formData.publishDate}
                onChange={e => handleChange('publishDate', e.target.value)}
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

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>
              <TranslatableText>Image</TranslatableText>
            </Label>
            <ImageUpload
              value={formData.imageUrl}
              onChange={(url) => handleChange('imageUrl', url)}
            />
          </div>
        </div>

        {/* Switches */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>
                <TranslatableText>Accessibility Available</TranslatableText>
              </Label>
              <p className="text-sm text-gray-500">
                <TranslatableText>Mark if this place is accessible for people with disabilities</TranslatableText>
              </p>
            </div>
            <Switch
              checked={formData.accessibility}
              onCheckedChange={(checked) => handleChange('accessibility', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>
                <TranslatableText>Published</TranslatableText>
              </Label>
              <p className="text-sm text-gray-500">
                <TranslatableText>Make this museum visible to visitors</TranslatableText>
              </p>
            </div>
            <Switch
              checked={formData.published}
              onCheckedChange={(checked) => handleChange('published', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>
                <TranslatableText>Featured</TranslatableText>
              </Label>
              <p className="text-sm text-gray-500">
                <TranslatableText>Highlight this museum on the homepage</TranslatableText>
              </p>
            </div>
            <Switch
              checked={formData.featured}
              onCheckedChange={(checked) => handleChange('featured', checked)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose} 
            disabled={loading}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2"
          >
            <TranslatableText>Cancel</TranslatableText>
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <SimpleHeartbeatLoader size="sm" className="mr-2" />
                <TranslatableText>Saving...</TranslatableText>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                <TranslatableText>Save Museum</TranslatableText>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 