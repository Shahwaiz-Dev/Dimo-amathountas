import { MunicipalityPage } from './firestore';

/**
 * Generate the correct route for a municipality page based on its category
 * This ensures consistent URL generation across the application
 */
export function getPageRoute(page: MunicipalityPage): string {
  switch (page.category) {
    case 'municipality':
      return `/municipality/${page.slug}`;
    case 'services':
      return `/services/${page.slug}`;
    case 'citizen-services':
      return `/citizen-services/${page.slug}`;
    case 'civil-marriages':
      return `/civil-marriages/${page.slug}`;
    default:
      // Default fallback to municipality route
      return `/municipality/${page.slug}`;
  }
}

/**
 * Generate route based on category ID and page slug
 * Useful when you have the category ID instead of the full page object
 */
export function getPageRouteByCategory(categoryId: string, slug: string): string {
  switch (categoryId) {
    case 'municipality':
      return `/municipality/${slug}`;
    case 'services':
      return `/services/${slug}`;
    case 'citizen-services':
      return `/citizen-services/${slug}`;
    case 'civil-marriages':
      return `/civil-marriages/${slug}`;
    default:
      // Default fallback to municipality route
      return `/municipality/${slug}`;
  }
}
