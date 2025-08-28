'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, Crop, RotateCw, Info, Check } from 'lucide-react';
import { uploadFile } from '@/government/lib/storage';
import { toast } from 'sonner';
import { TranslatableText } from '@/components/translatable-content';
import { SimpleHeartbeatLoader } from '@/components/ui/heartbeat-loader';
import ReactCrop, { Crop as CropType, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  folder?: string;
  label?: string;
  aspectRatio?: number; // width/height ratio (e.g., 16/9 for landscape)
  recommendedDimensions?: { width: number; height: number };
  cropMode?: 'free' | 'fixed' | 'auto';
}

export function ImageUpload({ 
  value, 
  onChange, 
  disabled = false, 
  folder = 'images',
  label = 'Image',
  aspectRatio,
  recommendedDimensions,
  cropMode = 'auto'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Update preview when value prop changes
  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  // Initialize crop when image loads
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setOriginalImage(e.currentTarget);
    
    if (aspectRatio && cropMode === 'fixed') {
      // Create centered crop with fixed aspect ratio
      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          aspectRatio,
          width,
          height,
        ),
        width,
        height,
      );
      setCrop(crop);
    } else if (cropMode === 'auto') {
      // Auto-crop to recommended dimensions or default to center crop
      const targetRatio = recommendedDimensions ? recommendedDimensions.width / recommendedDimensions.height : 16/9;
      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          targetRatio,
          width,
          height,
        ),
        width,
        height,
      );
      setCrop(crop);
    }
  };

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

    // Validate image dimensions
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      
      // Check minimum dimensions
      if (width < 200 || height < 200) {
        toast.error('Image must be at least 200x200 pixels');
        return;
      }
      
      // Check if image is too small for recommended dimensions
      if (recommendedDimensions) {
        if (width < recommendedDimensions.width * 0.5 || height < recommendedDimensions.height * 0.5) {
          toast.warning('Image is smaller than recommended. It may appear blurry when enlarged.');
        }
      }
      
      // Create preview URL for cropping
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setShowCropper(true);
      setCroppedImageUrl(null);
    };
    
    img.onerror = () => {
      toast.error('Failed to load image. Please try a different file.');
    };
    
    img.src = URL.createObjectURL(file);
  };

  const handleCropComplete = async () => {
    if (!completedCrop || !originalImage) return;

    try {
      // Create canvas for cropping
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const scaleX = originalImage.naturalWidth / originalImage.width;
      const scaleY = originalImage.naturalHeight / originalImage.height;

      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

      ctx.drawImage(
        originalImage,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
      );

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        // Create file from blob
        const croppedFile = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
        
        // Upload cropped image
        await uploadImage(croppedFile);
        
        // Clean up
        setShowCropper(false);
        setCrop(undefined);
        setCompletedCrop(undefined);
        setOriginalImage(null);
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error('Failed to crop image. Please try again.');
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      // Create unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}.${fileExtension}`;
      const filePath = `${folder}/${fileName}`;

      // Show upload progress
      toast.info('Uploading image... This may take a few moments.');

      // Upload to Firebase Storage
      const downloadURL = await uploadFile(file, filePath) as string;
      
      // Update form and preview
      onChange(downloadURL);
      setPreview(downloadURL);
      setCroppedImageUrl(downloadURL);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      
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
    setCroppedImageUrl(null);
    setShowCropper(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setOriginalImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  const skipCropping = () => {
    if (originalImage) {
      // Convert image element to file and upload directly
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = originalImage.naturalWidth;
      canvas.height = originalImage.naturalHeight;
      ctx.drawImage(originalImage, 0, 0);

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'original-image.jpg', { type: 'image/jpeg' });
        await uploadImage(file);
        setShowCropper(false);
        setCrop(undefined);
        setCompletedCrop(undefined);
        setOriginalImage(null);
      }, 'image/jpeg', 0.9);
    }
  };

  const getAspectRatioText = () => {
    if (aspectRatio) {
      if (aspectRatio > 1) {
        return `Landscape (${Math.round(aspectRatio * 100) / 100}:1)`;
      } else if (aspectRatio < 1) {
        return `Portrait (1:${Math.round((1 / aspectRatio) * 100) / 100})`;
      } else {
        return 'Square (1:1)';
      }
    }
    return 'Free form';
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold">
        <TranslatableText>{label}</TranslatableText>
      </Label>
      
      {/* Upload Guidelines */}
      {(aspectRatio || recommendedDimensions) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-blue-800">
              <Info className="h-4 w-4" />
              <TranslatableText>Upload Guidelines</TranslatableText>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm text-blue-700">
              {aspectRatio && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Recommended aspect ratio:</span>
                  <span className="bg-blue-100 px-2 py-1 rounded text-xs font-mono">
                    {getAspectRatioText()}
                  </span>
                </div>
              )}
              {recommendedDimensions && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Recommended dimensions:</span>
                  <span className="bg-blue-100 px-2 py-1 rounded text-xs font-mono">
                    {recommendedDimensions.width} × {recommendedDimensions.height}px
                  </span>
                </div>
              )}
              <p className="text-xs text-blue-600">
                <TranslatableText>Don't worry if your image doesn't match exactly - you can crop it to fit!</TranslatableText>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
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

        {/* Image Cropper */}
        {showCropper && originalImage && (
          <Card className="border-2 border-blue-300 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-blue-800">
                <TranslatableText>Crop Your Image</TranslatableText>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="relative max-w-full overflow-hidden rounded-lg border">
                  <ReactCrop
                    crop={crop}
                    onChange={(_: any, percentCrop: CropType) => setCrop(percentCrop)}
                    onComplete={(c: PixelCrop) => setCompletedCrop(c)}
                    aspect={aspectRatio}
                    minWidth={50}
                    minHeight={50}
                  >
                    <img
                      ref={imgRef}
                      alt="Crop preview"
                      src={preview || ''}
                      onLoad={onImageLoad}
                      className="max-w-full h-auto"
                    />
                  </ReactCrop>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleCropComplete}
                    disabled={!completedCrop || uploading}
                    className="flex items-center gap-2"
                  >
                    <Crop className="h-4 w-4" />
                    <TranslatableText>Crop & Upload</TranslatableText>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={skipCropping}
                    disabled={uploading}
                    className="flex items-center gap-2"
                  >
                    <RotateCw className="h-4 w-4" />
                    <TranslatableText>Skip Cropping</TranslatableText>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowCropper(false)}
                    disabled={uploading}
                  >
                    <TranslatableText>Cancel</TranslatableText>
                  </Button>
                </div>
                
                <div className="text-xs text-blue-600">
                  <TranslatableText>Drag the corners to adjust the crop area. The image will be automatically resized to fit the recommended dimensions.</TranslatableText>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Preview */}
        {preview && !showCropper && (
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
                {croppedImageUrl && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <TranslatableText>Cropped</TranslatableText>
                  </div>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <TranslatableText>Image Preview</TranslatableText>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Instructions */}
        {!preview && !showCropper && (
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