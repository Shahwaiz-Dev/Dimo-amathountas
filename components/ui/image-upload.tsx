'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadFile } from '@/government/lib/storage';
import { toast } from 'sonner';
import { TranslatableText } from '@/components/translatable-content';
import { SimpleHeartbeatLoader } from '@/components/ui/heartbeat-loader';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  folder?: string;
  label?: string;
}

export function ImageUpload({ 
  value, 
  onChange, 
  disabled = false, 
  folder = 'images',
  label = 'Image'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when value prop changes
  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      // Create unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}.${fileExtension}`;
      const filePath = `${folder}/${fileName}`;

      // Show upload progress
      toast.info('Uploading image... This may take a few moments.');

      // Upload to Firebase Storage with retry logic
      const downloadURL = await uploadFile(file, filePath) as string;
      
      // Update form and preview
      onChange(downloadURL);
      setPreview(downloadURL);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          toast.error('Upload timed out. Please check your internet connection and try again.');
        } else if (error.message.includes('permission')) {
          toast.error('Upload failed due to permission issues. Please contact support.');
        } else if (error.message.includes('quota')) {
          toast.error('Storage quota exceeded. Please contact support.');
        } else {
          toast.error(`Upload failed: ${error.message}`);
        }
      } else {
        toast.error('Failed to upload image. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold">
        <TranslatableText>{label}</TranslatableText>
      </Label>
      
      <div className="space-y-4">
        {/* Image URL Input (for manual entry) */}
        <div>
          <Label htmlFor="imageUrl" className="text-sm text-gray-600">
            <TranslatableText>Image URL (optional)</TranslatableText>
          </Label>
          <Input
            id="imageUrl"
            type="url"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setPreview(e.target.value);
            }}
            disabled={disabled || uploading}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Upload Section */}
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleChooseImage}
            disabled={disabled || uploading}
            className="flex items-center gap-2"
          >
            {uploading ? (
              <>
                <SimpleHeartbeatLoader size="sm" />
                <TranslatableText>Uploading...</TranslatableText>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <TranslatableText>Choose Image</TranslatableText>
              </>
            )}
          </Button>
          
          <span className="text-sm text-gray-500">
            {uploading ? (
              <TranslatableText>Please wait, uploading image...</TranslatableText>
            ) : (
              <TranslatableText>or drag and drop an image file</TranslatableText>
            )}
          </span>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || uploading}
        />

        {/* Image Preview */}
        {preview && (
          <Card className="max-w-md">
            <CardContent className="p-4">
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={() => setPreview(null)}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  disabled={disabled || uploading}
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <TranslatableText>Image Preview</TranslatableText>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Instructions */}
        {!preview && (
          <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
            <CardContent className="p-6 text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600">
                <TranslatableText>Click &quot;Choose Image&quot; to upload an image or enter a URL above</TranslatableText>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                <TranslatableText>Supported formats: JPG, PNG, GIF (max 5MB)</TranslatableText>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 