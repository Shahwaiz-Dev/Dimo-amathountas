# Admin Panel Filters

The admin panel now includes a comprehensive filtering system for managing news, events, and museums content. This system provides powerful search and filtering capabilities to help administrators efficiently manage their content.

## Overview

The filter system is available in three main sections:
- **News Management** (`/admin/news`)
- **Events Management** (`/admin/events`)
- **Museums Management** (`/admin/museums`)

## Features

### 🔍 **Advanced Search**
- Search across titles, descriptions, and content
- Real-time search with instant results
- Case-insensitive matching
- Support for both English and Greek content

### 📊 **Status Filtering**
- **Published**: Show only published content
- **Draft**: Show only draft content
- **Scheduled**: Show content scheduled for future publication
- **All Status**: Show all content regardless of status

### ⭐ **Featured Content Filtering**
- **Featured Only**: Show only featured content
- **Not Featured**: Show non-featured content
- **All Items**: Show all content regardless of featured status

### 📅 **Date Range Filtering**
- **Today**: Content created today
- **This Week**: Content created this week
- **This Month**: Content created this month
- **This Year**: Content created this year
- **All Time**: All content regardless of creation date

### 🏷️ **Category Filtering**
- Filter by specific categories
- Automatically populated from existing content
- Dynamic category list based on available content

### 📍 **Location Filtering** (Events & Museums)
- Filter by specific locations
- Automatically populated from existing content
- Support for localized location names

### ♿ **Accessibility Filtering** (Museums Only)
- **Accessible**: Show only accessible places
- **Not Accessible**: Show non-accessible places
- **All Places**: Show all places regardless of accessibility

## How to Use

### Accessing Filters

1. Navigate to any of the management pages (News, Events, or Museums)
2. Click the "Filters" button in the top toolbar
3. The filter panel will expand with all available options

### Using Filters

1. **Search**: Type in the search box to find content by title, description, or content
2. **Status**: Select the desired publication status
3. **Featured**: Choose to show featured, non-featured, or all content
4. **Date Range**: Select a time period for content creation
5. **Category**: Choose a specific category (if available)
6. **Location**: Select a specific location (Events & Museums only)
7. **Accessibility**: Filter by accessibility (Museums only)

### Filter Combinations

Filters work together to provide precise results:
- You can combine multiple filters simultaneously
- All filters are applied in real-time
- Results update immediately as you change filters

### Managing Active Filters

- **Active Filter Count**: The filter button shows a badge with the number of active filters
- **Clear Individual Filters**: Use the dropdown menus to reset individual filters
- **Clear All Filters**: Click "Clear All" to reset all filters at once
- **Results Summary**: See how many items match your current filters

## Visual Indicators

### Filter Button
- Shows a badge with the number of active filters
- Changes appearance when filters are active

### Results Summary
- Displays the number of filtered results vs total items
- Color-coded for different content types:
  - **News**: Blue theme
  - **Events**: Green theme
  - **Museums**: Purple theme

### Active Filter Badges
- Shows currently active filters as colored badges
- Easy to see which filters are applied
- Quick visual reference for filter state

## Technical Details

### Performance
- Client-side filtering for instant results
- Efficient filtering algorithms
- Optimized for large datasets

### Data Handling
- Handles both string and localized text objects
- Supports Firestore timestamp formats
- Graceful fallbacks for missing data

### Responsive Design
- Works on all screen sizes
- Mobile-friendly filter interface
- Collapsible filter panel to save space

## Best Practices

### For Administrators
1. **Start with Search**: Use the search function to quickly find specific content
2. **Use Status Filters**: Filter by status to focus on content that needs attention
3. **Combine Filters**: Use multiple filters together for precise results
4. **Clear Filters**: Remember to clear filters when switching between different tasks

### For Content Management
1. **Use Categories**: Assign categories to content for better organization
2. **Set Locations**: Add location information to events and museums
3. **Mark Accessibility**: Indicate accessibility features for museums
4. **Use Featured Status**: Mark important content as featured for easy filtering

## Troubleshooting

### Filters Not Working
- Refresh the page if filters seem unresponsive
- Check that you're on the correct management page
- Ensure the content has been loaded properly

### No Results Found
- Try clearing some filters to broaden your search
- Check spelling in search terms
- Verify that content exists with the selected criteria

### Performance Issues
- Clear unnecessary filters to improve performance
- Use more specific search terms
- Consider breaking down complex filter combinations

## Future Enhancements

The filter system is designed to be extensible and may include:
- **Saved Filter Presets**: Save commonly used filter combinations
- **Export Filtered Results**: Export filtered content to CSV/PDF
- **Advanced Date Filters**: More granular date range options
- **Bulk Actions**: Perform actions on filtered content sets
- **Filter Analytics**: Track most used filter combinations 