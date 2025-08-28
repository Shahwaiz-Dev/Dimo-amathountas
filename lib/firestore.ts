import { db } from '../government/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  Timestamp,
  query,
  orderBy,
  setDoc,
  where,
  limit
} from 'firebase/firestore';
import { AppearanceSettings } from './appearance-utils';

// Simple cache implementation
let newsCache: { data: any[]; timestamp: number } | null = null;
let eventsCache: { data: any[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// NEWS CRUD
export async function fetchNews() {
  // Check if we have valid cached data
  if (newsCache && (Date.now() - newsCache.timestamp) < CACHE_DURATION) {
    return newsCache.data;
  }

  try {
    const newsQuery = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(newsQuery);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Update cache
    newsCache = {
      data,
      timestamp: Date.now()
    };
    
    return data;
  } catch (error) {
    console.error('Error fetching news:', error);
    // Return cached data if available, even if expired
    if (newsCache) {
      return newsCache.data;
    }
    throw error;
  }
}

// Clear cache when news is modified
export function clearNewsCache() {
  newsCache = null;
}

export async function addNews(data: any) {
  const now = Timestamp.now();
  const result = await addDoc(collection(db, 'news'), {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  clearNewsCache(); // Clear cache after adding new news
  return result;
}

export async function updateNews(id: string, updates: any) {
  const result = await updateDoc(doc(db, 'news', id), {
    ...updates,
    updatedAt: Timestamp.now(),
  });
  clearNewsCache(); // Clear cache after updating news
  return result;
}

export async function deleteNews(id: string) {
  const result = await deleteDoc(doc(db, 'news', id));
  clearNewsCache(); // Clear cache after deleting news
  return result;
}

export async function getNewsById(id: string) {
  const docRef = doc(db, 'news', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

// EVENTS CRUD (similar pattern)
export async function fetchEvents() {
  // Check if we have valid cached data
  if (eventsCache && (Date.now() - eventsCache.timestamp) < CACHE_DURATION) {
    return eventsCache.data;
  }

  try {
    const eventsQuery = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(eventsQuery);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Update cache
    eventsCache = {
      data,
      timestamp: Date.now()
    };
    
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    // Return cached data if available, even if expired
    if (eventsCache) {
      return eventsCache.data;
    }
    throw error;
  }
}

// Clear cache when events are modified
export function clearEventsCache() {
  eventsCache = null;
}

export async function addEvent(data: any) {
  const now = Timestamp.now();
  const result = await addDoc(collection(db, 'events'), {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  clearEventsCache(); // Clear cache after adding new event
  return result;
}

export async function updateEvent(id: string, updates: any) {
  const result = await updateDoc(doc(db, 'events', id), {
    ...updates,
    updatedAt: Timestamp.now(),
  });
  clearEventsCache(); // Clear cache after updating event
  return result;
}

export async function deleteEvent(id: string) {
  const result = await deleteDoc(doc(db, 'events', id));
  clearEventsCache(); // Clear cache after deleting event
  return result;
}

export async function getEventById(id: string) {
  const docRef = doc(db, 'events', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
} 

// Municipality Pages
export interface MunicipalityPage {
  id: string;
  slug: string;
  title: {
    en: string;
    el: string;
  };
  content: {
    en: string;
    el: string;
  };
  excerpt?: {
    en: string;
    el: string;
  };
  imageUrl?: string;
  category: string;
  lastUpdated: Date;
  isPublished: boolean;
  createdAt: Date;
  layout?: 'layout1' | 'layout2' | 'layout3';
}

export async function getMunicipalityPage(slug: string): Promise<MunicipalityPage | null> {
  try {
    // Query by slug field instead of using slug as document ID
    const q = query(
      collection(db, 'municipalityPages'),
      where('slug', '==', slug),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
      } as MunicipalityPage;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching municipality page:', error);
    return null;
  }
}

export async function getAllMunicipalityPages(): Promise<MunicipalityPage[]> {
  try {
    const q = query(
      collection(db, 'municipalityPages'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const pages: MunicipalityPage[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      pages.push({
        id: doc.id,
        ...data,
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
      } as MunicipalityPage);
    });
    
    return pages;
  } catch (error) {
    console.error('Error fetching municipality pages:', error);
    return [];
  }
}

export async function createMunicipalityPage(pageData: Omit<MunicipalityPage, 'id' | 'createdAt' | 'lastUpdated'>): Promise<string | null> {
  try {
    // Check if a page with this slug already exists
    const existingPage = await getMunicipalityPage(pageData.slug);
    if (existingPage) {
      console.error('Page with this slug already exists:', pageData.slug);
      return null;
    }

    const now = new Date();
    
    // Use addDoc to create a new document with auto-generated ID
    const docRef = await addDoc(collection(db, 'municipalityPages'), {
      ...pageData,
      createdAt: now,
      lastUpdated: now,
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating municipality page:', error);
    return null;
  }
}

export async function updateMunicipalityPage(slug: string, updates: Partial<MunicipalityPage>): Promise<boolean> {
  try {
    // First find the document by slug
    const q = query(
      collection(db, 'municipalityPages'),
      where('slug', '==', slug),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.error('Page not found with slug:', slug);
      return false;
    }
    
    const docRef = doc(db, 'municipalityPages', querySnapshot.docs[0].id);
    
    await updateDoc(docRef, {
      ...updates,
      lastUpdated: new Date(),
    });
    
    return true;
  } catch (error) {
    console.error('Error updating municipality page:', error);
    return false;
  }
}

export async function deleteMunicipalityPage(slug: string): Promise<boolean> {
  try {
    // First find the document by slug
    const q = query(
      collection(db, 'municipalityPages'),
      where('slug', '==', slug),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.error('Page not found with slug:', slug);
      return false;
    }
    
    const docRef = doc(db, 'municipalityPages', querySnapshot.docs[0].id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting municipality page:', error);
    return false;
  }
}

// MUSEUMS AND PLACES CRUD
let museumsCache: { data: any[]; timestamp: number } | null = null;

export async function fetchMuseums() {
  // Check if we have valid cached data
  if (museumsCache && (Date.now() - museumsCache.timestamp) < CACHE_DURATION) {
    return museumsCache.data;
  }

  try {
    const museumsQuery = query(collection(db, 'museums'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(museumsQuery);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Update cache
    museumsCache = {
      data,
      timestamp: Date.now()
    };
    
    return data;
  } catch (error) {
    console.error('Error fetching museums:', error);
    // Return cached data if available, even if expired
    if (museumsCache) {
      return museumsCache.data;
    }
    throw error;
  }
}

export function clearMuseumsCache() {
  museumsCache = null;
}

export async function addMuseum(data: any) {
  const now = Timestamp.now();
  const result = await addDoc(collection(db, 'museums'), {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  clearMuseumsCache();
  return result;
}

export async function updateMuseum(id: string, updates: any) {
  const result = await updateDoc(doc(db, 'museums', id), {
    ...updates,
    updatedAt: Timestamp.now(),
  });
  clearMuseumsCache();
  return result;
}

export async function deleteMuseum(id: string) {
  const result = await deleteDoc(doc(db, 'museums', id));
  clearMuseumsCache();
  return result;
}

export async function getMuseumById(id: string) {
  const docRef = doc(db, 'museums', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
} 

// Page Categories CRUD
export interface PageCategory {
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
  showInNavbar?: boolean; // Added for navbar filtering
  parentCategory?: string; // Added for subcategories
}

export async function getPageCategories(): Promise<PageCategory[]> {
  try {
    const snapshot = await getDocs(collection(db, 'pageCategories'));
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PageCategory));
    return categories;
  } catch (error) {
    console.error('Error fetching page categories:', error);
    return [];
  }
}

export async function addPageCategory(data: Omit<PageCategory, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'pageCategories'), data);
  return docRef.id;
}

export async function updatePageCategory(id: string, data: Partial<PageCategory>): Promise<void> {
  await updateDoc(doc(db, 'pageCategories', id), data);
}

export async function deletePageCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, 'pageCategories', id));
}



export async function getNavbarCategories(): Promise<PageCategory[]> {
  try {
    const snapshot = await getDocs(collection(db, 'pageCategories'));
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PageCategory));
    
    // Return only categories that should be shown in navbar
    return categories
      .filter(cat => cat.isActive && cat.showInNavbar);
  } catch (error) {
    console.error('Error fetching navbar categories:', error);
    return [];
  }
 }

export async function getCategoriesWithSubcategories(): Promise<PageCategory[]> {
  try {
    const snapshot = await getDocs(collection(db, 'pageCategories'));
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PageCategory));
    
    // Return categories as-is since we removed ordering
    return categories;
  } catch (error) {
    console.error('Error fetching categories with subcategories:', error);
    return [];
  }
}

export async function getSubcategories(parentCategoryId: string): Promise<PageCategory[]> {
  try {
    const snapshot = await getDocs(collection(db, 'pageCategories'));
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PageCategory));
    
    // Return subcategories of the specified parent
    return categories
      .filter(cat => cat.isActive && (cat as any).parentCategory === parentCategoryId);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
}

// APPEARANCE SETTINGS

// Cache for appearance settings
let appearanceSettingsCache: { data: AppearanceSettings | null; timestamp: number } | null = null;

// Get appearance settings from Firestore
export async function getAppearanceSettingsFromFirestore(): Promise<AppearanceSettings | null> {
  // Check if we have valid cached data
  if (appearanceSettingsCache && (Date.now() - appearanceSettingsCache.timestamp) < CACHE_DURATION) {
    return appearanceSettingsCache.data;
  }

  try {
    const docRef = doc(db, 'settings', 'appearance');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as AppearanceSettings;
      
      // Update cache
      appearanceSettingsCache = {
        data,
        timestamp: Date.now()
      };
      
      return data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching appearance settings:', error);
    // Return cached data if available, even if expired
    if (appearanceSettingsCache) {
      return appearanceSettingsCache.data;
    }
    return null;
  }
}

// Save appearance settings to Firestore
export async function saveAppearanceSettingsToFirestore(settings: AppearanceSettings): Promise<void> {
  try {
    const docRef = doc(db, 'settings', 'appearance');
    await setDoc(docRef, settings);
    
    // Update cache with the new settings instead of clearing it
    appearanceSettingsCache = {
      data: settings,
      timestamp: Date.now()
    };
    
    console.log('Appearance settings saved to Firestore and cache updated');
  } catch (error) {
    console.error('Error saving appearance settings:', error);
    throw error;
  }
}