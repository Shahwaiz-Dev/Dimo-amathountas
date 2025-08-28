export interface AppearanceSettings {
  heroImages: {
    image1: string;
    image2: string;
  };
  exploreTownImage: string;
  eventsSectionImage: string;
  museumsSectionImage: string;
}

const defaultSettings: AppearanceSettings = {
  heroImages: {
    image1: '/h1.jpeg',
    image2: '/h2.jpeg',
  },
  exploreTownImage: '/hero2.jpeg',
  eventsSectionImage: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80',
  museumsSectionImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
};

export async function getAppearanceSettings(): Promise<AppearanceSettings> {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }

  try {
    // Import dynamically to avoid server-side issues
    const { getAppearanceSettingsFromFirestore } = await import('./firestore');
    const firestoreSettings = await getAppearanceSettingsFromFirestore();
    
    if (firestoreSettings) {
      return { ...defaultSettings, ...firestoreSettings };
    }
  } catch (error) {
    console.error('Error getting appearance settings from Firestore:', error);
    // Silently handle errors and return defaults
  }

  return defaultSettings;
}

// Synchronous version for components that can't use async
export function getAppearanceSettingsSync(): AppearanceSettings {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }

  try {
    // Fallback to localStorage for synchronous calls
    const savedSettings = localStorage.getItem('appearanceSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      return { ...defaultSettings, ...parsed };
    }
  } catch (error) {
    console.error('Error getting appearance settings from localStorage:', error);
    // Silently handle errors and return defaults
  }

  return defaultSettings;
}

export async function getHeroImages() {
  const settings = await getAppearanceSettings();
  return settings.heroImages;
}

// Synchronous version for components that can't use async
export function getHeroImagesSync() {
  const settings = getAppearanceSettingsSync();
  return settings.heroImages;
}

export async function getExploreTownImage() {
  const settings = await getAppearanceSettings();
  return settings.exploreTownImage;
}

// Synchronous version for components that can't use async
export function getExploreTownImageSync() {
  const settings = getAppearanceSettingsSync();
  // Only return the exploreTownImage if it's not the default value
  return settings.exploreTownImage !== '/hero2.jpeg' ? settings.exploreTownImage : '';
}

export async function getEventsSectionImage() {
  const settings = await getAppearanceSettings();
  return settings.eventsSectionImage;
}

// Synchronous version for components that can't use async
export function getEventsSectionImageSync() {
  const settings = getAppearanceSettingsSync();
  return settings.eventsSectionImage;
}

export async function getMuseumsSectionImage() {
  const settings = await getAppearanceSettings();
  return settings.museumsSectionImage;
}

// Synchronous version for components that can't use async
export function getMuseumsSectionImageSync() {
  const settings = getAppearanceSettingsSync();
  return settings.museumsSectionImage;
}

// Save settings to Firestore
export async function saveAppearanceSettings(settings: AppearanceSettings): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Import dynamically to avoid server-side issues
    const { saveAppearanceSettingsToFirestore } = await import('./firestore');
    await saveAppearanceSettingsToFirestore(settings);
    
    // Also save to localStorage as fallback
    localStorage.setItem('appearanceSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving appearance settings:', error);
    throw error;
  }
}