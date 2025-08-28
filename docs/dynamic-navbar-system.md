# Dynamic Navbar System

## ⚠️ Current Issue - Categories Not Showing in Navbar

If your categories are not appearing in the navbar, please check:

1. **Category Settings**: Ensure the category has:
   - `isActive: true`
   - `showInNavbar: true`
   - A valid `navOrder` value

2. **Debug Steps**:
   - Go to Admin > Page Categories
   - Look at the "Debug: Navbar Categories Status" section
   - Check if your categories appear in the list
   - Verify the console logs in browser developer tools

3. **Common Solutions**:
   - Edit the category and ensure "Show in Navbar" is checked
   - Set a "Navbar Order" value (lower numbers appear first)
   - Make sure the category is "Active"

## Overview

The dynamic navbar system allows administrators to create up to 10 categories that will appear in the main navigation bar. Each category can have subcategories, and both categories and subcategories can have associated pages.

## Features

- **Maximum 10 navbar categories**: The system enforces a limit of 10 categories that can be displayed in the navbar
- **Subcategory support**: Categories can have subcategories for better organization
- **Dynamic page creation**: Pages can be created for both categories and subcategories
- **Slug-based URLs**: Clean, SEO-friendly URLs using custom slugs
- **Multilingual support**: Full support for English and Greek languages
- **Responsive design**: Works on both desktop and mobile devices

## How to Use

### 1. Creating Categories

1. Go to **Admin > Page Categories**
2. Click **"Create Category"**
3. Fill in the required information:
   - **Name**: Category name in both English and Greek
   - **Description**: Optional description
   - **Icon**: Choose an icon for the category
   - **Color**: Choose a color theme
   - **Show in Navbar**: Enable to show in the main navigation
   - **Navbar Order**: Set the display order (lower numbers appear first)
   - **Slug**: Custom URL-friendly name (optional, auto-generated if empty)

### 2. Creating Subcategories

1. In the category creation form, set **"Parent Category"** to the main category
2. Subcategories will automatically appear as dropdown items under their parent
3. Subcategories can also have their own pages

### 3. Managing Navbar Categories

- **Limit enforcement**: The system prevents creating more than 10 navbar categories
- **Order control**: Use the navbar order field to control display sequence
- **Active status**: Only active categories appear in the navbar
- **Real-time counter**: See how many navbar categories are currently active

### 4. URL Structure

The system generates clean URLs based on the following pattern:

- **Category page**: `/{category-slug}`
- **Subcategory page**: `/{subcategory-slug}`
- **Page within category**: `/{category-slug}/{page-slug}`

### 5. Navbar Behavior

- **Desktop**: Categories with subcategories show as dropdown menus
- **Mobile**: Categories expand/collapse with smooth animations
- **Hover effects**: Desktop dropdowns appear on hover
- **Click navigation**: Mobile navigation uses click to expand

## Best Practices

### Category Organization

1. **Keep it simple**: Don't create too many subcategories
2. **Logical grouping**: Group related content under main categories
3. **Clear naming**: Use descriptive names that users will understand
4. **Consistent ordering**: Use the order fields to maintain logical flow

### Content Management

1. **Regular updates**: Keep category content fresh and relevant
2. **SEO optimization**: Use meaningful slugs for better search engine visibility
3. **Multilingual consistency**: Ensure both language versions are complete
4. **Mobile optimization**: Test navigation on mobile devices

### Performance Considerations

1. **Limit enforcement**: Respect the 10-category limit for optimal performance
2. **Efficient loading**: Categories are loaded efficiently with caching
3. **Smooth animations**: Animations are optimized for performance

## Technical Details

### Data Structure

```typescript
interface PageCategory {
  id: string;
  name: { en: string; el: string };
  description?: { en: string; el: string };
  icon?: string;
  color?: string;
  isActive?: boolean;
  order?: number;
  navOrder?: number;
  showInNavbar?: boolean;
  parentCategory?: string;
  slug?: string;
}
```

### Key Functions

- `getNavbarCategories()`: Fetches categories for navbar display
- `getSubcategories(parentId)`: Gets subcategories of a parent
- `addPageCategory(data)`: Creates new categories
- `updatePageCategory(id, data)`: Updates existing categories

### State Management

- **Dropdown states**: Managed per category for independent dropdown behavior
- **Loading states**: Proper loading indicators for better UX
- **Error handling**: Graceful fallbacks for missing data

## Troubleshooting

### Common Issues

1. **Category not appearing**: Check if `showInNavbar` is enabled and `isActive` is true
2. **Subcategory not showing**: Verify `parentCategory` is set correctly
3. **Order not working**: Ensure `navOrder` values are set properly
4. **Limit reached**: Disable another navbar category before enabling a new one

### Debug Tips

1. **Check console**: Look for JavaScript errors in browser console
2. **Verify data**: Ensure category data is properly saved in Firestore
3. **Test navigation**: Try both desktop and mobile navigation
4. **Check slugs**: Verify URL slugs are properly formatted

## Future Enhancements

- **Category templates**: Pre-defined category layouts
- **Advanced ordering**: Drag-and-drop category reordering
- **Analytics**: Track category usage and popularity
- **A/B testing**: Test different category organizations
- **Custom styling**: More customization options for category appearance
