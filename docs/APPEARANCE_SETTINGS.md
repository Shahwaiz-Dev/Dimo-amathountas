# Appearance Settings

The Appearance Settings section in the admin panel allows you to customize the visual appearance of your website by managing background images for key sections.

## Accessing Appearance Settings

1. Navigate to the Admin Panel (`/admin`)
2. Click on "Appearance" in the left sidebar
3. You'll see options to manage different image settings

## Available Settings

### Hero Section Background Images

The hero section displays a rotating carousel of images on the homepage. You can customize:

- **Hero Image 1**: First image in the carousel rotation
- **Hero Image 2**: Second image in the carousel rotation

### Explore Our Town Section

The "Explore Our Town" section appears on the homepage and can be customized with:

- **Explore Town Image**: Background image for the explore town section

## How to Use

### Uploading New Images

1. Click "Choose Image" for the section you want to customize
2. Select an image file from your computer
3. The image will be uploaded to Firebase Storage
4. A preview will be shown immediately

### Using Image URLs

Alternatively, you can:
1. Enter an image URL directly in the URL field
2. The image will be used without uploading

### Saving Changes

1. After making your changes, click "Save Changes"
2. Your settings will be saved to localStorage
3. The changes will be applied immediately to the website

### Resetting to Default

1. Click "Reset to Default" to restore original images
2. This will remove all custom settings

## Image Requirements

- **Supported formats**: JPG, PNG, GIF
- **Maximum file size**: 5MB
- **Recommended dimensions**: 
  - Hero images: 1920x1080 or similar aspect ratio
  - Explore town image: 800x600 or similar aspect ratio

## Technical Details

- Settings are stored in browser localStorage
- Images are uploaded to Firebase Storage in organized folders
- Changes are applied immediately without page refresh
- Fallback to default images if custom images fail to load

## Troubleshooting

### Images Not Loading
- Check that the image URL is accessible
- Ensure the image format is supported
- Verify the file size is under 5MB

### Changes Not Appearing
- Refresh the page to see changes
- Clear browser cache if needed
- Check browser console for any errors

### Upload Failures
- Check your internet connection
- Ensure Firebase Storage is properly configured
- Try uploading a smaller image file 