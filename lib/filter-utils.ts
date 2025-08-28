import { FilterOptions } from '@/components/admin/content-filters';
import { getLocalizedText } from '@/lib/utils';

// Helper function to get date from Firestore timestamp or string
const getDateFromItem = (item: any, dateField: string): Date => {
  if (item[dateField]?.seconds) {
    return new Date(item[dateField].seconds * 1000);
  }
  if (typeof item[dateField] === 'string') {
    return new Date(item[dateField]);
  }
  if (typeof item[dateField] === 'number') {
    return new Date(item[dateField]);
  }
  return new Date();
};

// Helper function to check if item is scheduled
const isScheduled = (item: any): boolean => {
  const now = new Date();
  const publishDate = getDateFromItem(item, 'publishDate');
  return publishDate > now && !item.published;
};

// Helper function to check if item is in date range
const isInDateRange = (item: any, dateRange: string): boolean => {
  const itemDate = getDateFromItem(item, 'createdAt');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  switch (dateRange) {
    case 'today':
      return itemDate >= today;
    case 'week':
      return itemDate >= startOfWeek;
    case 'month':
      return itemDate >= startOfMonth;
    case 'year':
      return itemDate >= startOfYear;
    default:
      return true;
  }
};

// Apply filters to news items
export function applyNewsFilters(news: any[], filters: FilterOptions): any[] {
  return news.filter(item => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const title = getLocalizedText(item.title).toLowerCase();
      const excerpt = getLocalizedText(item.excerpt).toLowerCase();
      const content = getLocalizedText(item.content).toLowerCase();
      
      if (!title.includes(searchLower) && 
          !excerpt.includes(searchLower) && 
          !content.includes(searchLower)) {
        return false;
      }
    }

    // Status filter
    if (filters.status !== 'all') {
      switch (filters.status) {
        case 'published':
          if (!item.published) return false;
          break;
        case 'draft':
          if (item.published) return false;
          break;
        case 'scheduled':
          if (!isScheduled(item)) return false;
          break;
      }
    }

    // Featured filter
    if (filters.featured !== 'all') {
      if (filters.featured === 'featured' && !item.featured) return false;
      if (filters.featured === 'not-featured' && item.featured) return false;
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      if (!isInDateRange(item, filters.dateRange)) return false;
    }

    // Category filter
    if (filters.category && item.category !== filters.category) {
      return false;
    }

    return true;
  });
}

// Apply filters to events items
export function applyEventsFilters(events: any[], filters: FilterOptions): any[] {
  return events.filter(item => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const title = getLocalizedText(item.title).toLowerCase();
      const description = getLocalizedText(item.description).toLowerCase();
      const location = getLocalizedText(item.location).toLowerCase();
      
      if (!title.includes(searchLower) && 
          !description.includes(searchLower) && 
          !location.includes(searchLower)) {
        return false;
      }
    }

    // Status filter
    if (filters.status !== 'all') {
      switch (filters.status) {
        case 'published':
          if (!item.published) return false;
          break;
        case 'draft':
          if (item.published) return false;
          break;
        case 'scheduled':
          if (!isScheduled(item)) return false;
          break;
      }
    }

    // Featured filter
    if (filters.featured !== 'all') {
      if (filters.featured === 'featured' && !item.featured) return false;
      if (filters.featured === 'not-featured' && item.featured) return false;
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      if (!isInDateRange(item, filters.dateRange)) return false;
    }

    // Category filter
    if (filters.category && item.category !== filters.category) {
      return false;
    }

    // Location filter
    if (filters.location) {
      const itemLocation = getLocalizedText(item.location);
      if (itemLocation !== filters.location) return false;
    }

    return true;
  });
}

// Apply filters to museums items
export function applyMuseumsFilters(museums: any[], filters: FilterOptions): any[] {
  return museums.filter(item => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const title = getLocalizedText(item.title).toLowerCase();
      const description = getLocalizedText(item.description).toLowerCase();
      const location = getLocalizedText(item.location).toLowerCase();
      
      if (!title.includes(searchLower) && 
          !description.includes(searchLower) && 
          !location.includes(searchLower)) {
        return false;
      }
    }

    // Status filter
    if (filters.status !== 'all') {
      switch (filters.status) {
        case 'published':
          if (!item.published) return false;
          break;
        case 'draft':
          if (item.published) return false;
          break;
        case 'scheduled':
          if (!isScheduled(item)) return false;
          break;
      }
    }

    // Featured filter
    if (filters.featured !== 'all') {
      if (filters.featured === 'featured' && !item.featured) return false;
      if (filters.featured === 'not-featured' && item.featured) return false;
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      if (!isInDateRange(item, filters.dateRange)) return false;
    }

    // Category filter
    if (filters.category && item.category !== filters.category) {
      return false;
    }

    // Location filter
    if (filters.location) {
      const itemLocation = getLocalizedText(item.location);
      if (itemLocation !== filters.location) return false;
    }

    // Accessibility filter
    if (filters.accessibility && filters.accessibility !== 'all') {
      if (filters.accessibility === 'accessible' && !item.accessibility) return false;
      if (filters.accessibility === 'not-accessible' && item.accessibility) return false;
    }

    return true;
  });
}

// Extract unique categories from items
export function extractCategories(items: any[]): string[] {
  const categories = new Set<string>();
  items.forEach(item => {
    if (item.category) {
      categories.add(item.category);
    }
  });
  return Array.from(categories).sort();
}

// Extract unique locations from items
export function extractLocations(items: any[]): string[] {
  const locations = new Set<string>();
  items.forEach(item => {
    if (item.location) {
      const location = getLocalizedText(item.location);
      if (location) {
        locations.add(location);
      }
    }
  });
  return Array.from(locations).sort();
} 