# Page Categories Management

This document describes the new page categories functionality that allows you to create, edit, and manage page categories dynamically.

## Overview

The page categories system allows administrators to:
- Create custom page categories with multilingual support (English/Greek)
- Assign icons and colors to categories
- Control the display order of categories
- Enable/disable categories
- Use categories when creating municipality pages

## Features

### 1. Category Management
- **Create Categories**: Add new page categories with names, descriptions, icons, and colors
- **Edit Categories**: Modify existing categories
- **Delete Categories**: Remove categories (with confirmation)
- **Reorder Categories**: Change the display order using up/down arrows
- **Active/Inactive Status**: Enable or disable categories

### 2. Multilingual Support
- All category names and descriptions support both English and Greek
- Consistent with the existing translation system

### 3. Visual Customization
- **Icons**: Choose from predefined icon options (Building, Users, Settings, Heart, Tag, FileText)
- **Colors**: Select from color themes (Blue, Green, Purple, Pink, Orange, Red, Gray)
- **Order**: Control the display order of categories

## Admin Interface

### Accessing Categories Management
1. Navigate to the admin panel (`/admin`)
2. Click on "Categories" in the sidebar navigation
3. You'll see the categories management interface

### Creating a New Category
1. Click the "Create Category" button
2. Fill in the form:
   - **Name (English)**: Category name in English
   - **Name (Greek)**: Category name in Greek
   - **Description (English)**: Optional description in English
   - **Description (Greek)**: Optional description in Greek
   - **Icon**: Choose an icon from the dropdown
   - **Color**: Select a color theme
   - **Display Order**: Set the order (lower numbers appear first)
   - **Active**: Toggle to enable/disable the category
3. Click "Create Category"

### Editing a Category
1. Click the "Edit" button next to any category
2. Modify the fields as needed
3. Click "Update Category"

### Deleting a Category
1. Click the "Delete" button next to any category
2. Confirm the deletion in the dialog
3. The category will be permanently removed

### Reordering Categories
1. Use the up/down arrow buttons next to each category
2. Categories will be reordered immediately
3. The new order is saved automatically

## Using Categories in Page Creation

When creating municipality pages:
1. Navigate to "Pages" in the admin panel
2. Click "Create Page"
3. In the category dropdown, you'll see all active categories
4. Select the appropriate category for your page
5. The page will be associated with that category

## Database Structure

Categories are stored in the `pageCategories` collection with the following structure:

```typescript
interface PageCategory {
  id: string;
  name: {
    en: string;
    el: string;
  };
  description?: {
    en: string;
    el: string;
  };
  icon?: string;
  color?: string;
  isActive?: boolean;
  order?: number;
}
```

## Default Categories

The system comes with four default categories:
1. **Municipality** (Δήμος) - Blue, Building icon
2. **Citizen Services** (Υπηρεσίες Πολιτών) - Green, Users icon
3. **Services** (Υπηρεσίες) - Purple, Settings icon
4. **Civil Marriages** (Πολιτικοί Γάμοι) - Pink, Heart icon

## Initialization

To initialize the default categories, you can run the provided script:

```bash
node scripts/init-categories.js
```

**Note**: You'll need to configure your Firebase credentials in the script before running it.

## Technical Implementation

### Components
- `PageCategoriesManagement`: Main component for managing categories
- `municipality-pages-management.tsx`: Updated to use dynamic categories

### Database Functions
- `getPageCategories()`: Fetch all categories
- `addPageCategory()`: Create a new category
- `updatePageCategory()`: Update an existing category
- `deletePageCategory()`: Delete a category

### Integration
The categories system is integrated with:
- Municipality pages creation and editing
- Admin navigation
- Category filtering and display

## Best Practices

1. **Naming**: Use clear, descriptive names for categories
2. **Ordering**: Keep related categories together by using sequential order numbers
3. **Icons**: Choose icons that represent the category content
4. **Colors**: Use consistent color schemes for related categories
5. **Descriptions**: Provide helpful descriptions for better organization

## Troubleshooting

### Categories Not Loading
- Check if the `pageCategories` collection exists in Firestore
- Verify that categories have the correct data structure
- Check browser console for any errors

### Categories Not Appearing in Page Creation
- Ensure the category is marked as "Active"
- Check that the category has both English and Greek names
- Verify the category order is set correctly

### Permission Issues
- Ensure you have proper Firebase permissions
- Check that the admin authentication is working correctly 