'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { TranslatableText } from '@/components/translatable-content';
import { Palette, Image as ImageIcon, Save, GripVertical, X } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import { AppearanceSettings } from '@/lib/appearance-utils';

import { getAppearanceSettings } from '@/lib/appearance-utils';

const defaultSettings: AppearanceSettings = {
  heroImages: {
    image1: '/h1.jpeg',
    image2: '/h2.jpeg',
  },
  exploreTownImage: '/hero2.jpeg',
  eventsSectionImage: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80',
  museumsSectionImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  mainNavigationOrder: ['home', 'news', 'events', 'contact', 'museums'],
};

export default function AppearancePage() {
  const [settings, setSettings] = useState<AppearanceSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Load settings from Firestore on component mount
  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const { getAppearanceSettingsFromFirestore } = await import('@/lib/firestore');
        const firestoreSettings = await getAppearanceSettingsFromFirestore();
        
        if (firestoreSettings) {
          console.log('Loaded settings from Firestore:', firestoreSettings);
          setSettings({ ...defaultSettings, ...firestoreSettings });
        } else {
          // Fallback to localStorage if no Firestore settings
          const savedSettings = localStorage.getItem('appearanceSettings');
          if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            console.log('Loaded settings from localStorage:', parsed);
            setSettings({ ...defaultSettings, ...parsed });
          } else {
            console.log('No settings found, using defaults');
          }
        }
      } catch (error) {
        console.error('Error loading appearance settings:', error);
        // Keep default settings if there's an error
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    }
    
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to Firestore and localStorage
      const { saveAppearanceSettingsToFirestore } = await import('@/lib/firestore');
      await saveAppearanceSettingsToFirestore(settings);
      
      // Also save to localStorage as fallback
      localStorage.setItem('appearanceSettings', JSON.stringify(settings));
      
      toast({
        title: 'Settings saved successfully!',
        description: 'Your appearance changes have been applied to all devices.',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error saving settings',
        description: 'Please try again.',
        duration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSettings(defaultSettings);
    
    try {
      // Reset in Firestore
      const { saveAppearanceSettingsToFirestore } = await import('@/lib/firestore');
      await saveAppearanceSettingsToFirestore(defaultSettings);
      
      // Also clear localStorage
      localStorage.removeItem('appearanceSettings');
      
      toast({
        title: 'Settings reset to default',
        description: 'All appearance settings have been reset on all devices.',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast({
        title: 'Error resetting settings',
        description: 'Please try again.',
        duration: 3000,
      });
    }
  };

  const updateHeroImage = (index: 1 | 2, url: string) => {
    setSettings(prev => ({
      ...prev,
      heroImages: {
        ...prev.heroImages,
        [`image${index}`]: url
      }
    }));
  };

  const updateExploreTownImage = (url: string) => {
    setSettings(prev => ({
      ...prev,
      exploreTownImage: url
    }));
  };

  const updateEventsSectionImage = (url: string) => {
    setSettings(prev => ({
      ...prev,
      eventsSectionImage: url
    }));
  };

  const updateMuseumsSectionImage = (url: string) => {
    setSettings(prev => ({
      ...prev,
      museumsSectionImage: url
    }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Palette className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            <TranslatableText>{{ en: "Appearance Settings", el: "Ρυθμίσεις Εμφάνισης" }}</TranslatableText>
          </h1>
          <p className="text-gray-600">
            <TranslatableText>{{ en: "Customize the visual appearance of your website", el: "Προσαρμόστε την οπτική εμφάνιση της ιστοσελίδας σας" }}</TranslatableText>
          </p>
          <p className="text-sm text-blue-600">
            <TranslatableText>{{ en: "💡 New: Smart image guidelines help ensure your images look perfect in every layout!", el: "💡 Νέα: Οι έξυπνες οδηγίες εικόνων βοηθούν να φαίνονται οι εικόνες σας τέλεια σε κάθε διάταξη!" }}</TranslatableText>
          </p>
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              <TranslatableText>{{ en: "✨ How it works: Upload any image → System provides guidelines → Images automatically fit the layout!", el: "✨ Πώς λειτουργεί: Ανεβάστε οποιαδήποτε εικόνα → Το σύστημα παρέχει οδηγίες → Οι εικόνες ταιριάζουν αυτόματα στη διάταξη!" }}</TranslatableText>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Hero Section Images */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              <TranslatableText>{{ en: "Hero Section Background Images", el: "Εικόνες Φόντου Τμήματος Hero" }}</TranslatableText>
            </CardTitle>
            <p className="text-gray-600 text-sm">
              <TranslatableText>{{ en: "These images are used in the rotating hero carousel on the homepage", el: "Αυτές οι εικόνες χρησιμοποιούνται στο περιστρεφόμενο carousel hero στην αρχική σελίδα" }}</TranslatableText>
            </p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Hero Image 1 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                <TranslatableText>{{ en: "Hero Image 1", el: "Εικόνα Hero 1" }}</TranslatableText>
              </h3>
              <ImageUpload
                value={settings.heroImages.image1}
                onChange={(url) => updateHeroImage(1, url)}
                folder="hero-images"
                label=""
                aspectRatio={16/9}
                recommendedDimensions={{ width: 1920, height: 1080 }}
              />
            </div>

            {/* Hero Image 2 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                <TranslatableText>{{ en: "Hero Image 2", el: "Εικόνα Hero 2" }}</TranslatableText>
              </h3>
              <ImageUpload
                value={settings.heroImages.image2}
                onChange={(url) => updateHeroImage(2, url)}
                folder="hero-images"
                label=""
                aspectRatio={16/9}
                recommendedDimensions={{ width: 1920, height: 1080 }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Explore Town Section Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <ImageIcon className="w-5 h-5 text-green-600" />
              <TranslatableText>{{ en: "Explore Our Town Section", el: "Τμήμα Εξερευνήστε την Πόλη μας" }}</TranslatableText>
            </CardTitle>
            <p className="text-gray-600 text-sm">
              <TranslatableText>{{ en: "This image appears in the 'Explore Our Town' section on the homepage", el: "Αυτή η εικόνα εμφανίζεται στο τμήμα 'Εξερευνήστε την Πόλη μας' στην αρχική σελίδα" }}</TranslatableText>
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <ImageUpload
              value={settings.exploreTownImage}
              onChange={updateExploreTownImage}
              folder="explore-town"
              label=""
              aspectRatio={4/3}
              recommendedDimensions={{ width: 1200, height: 900 }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Events Section Background Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <ImageIcon className="w-5 h-5 text-orange-600" />
              <TranslatableText>{{ en: "Events Section Background", el: "Φόντο Τμήματος Εκδηλώσεων" }}</TranslatableText>
            </CardTitle>
            <p className="text-gray-600 text-sm">
              <TranslatableText>{{ en: "This image appears as the background for the 'Upcoming Events' section on the homepage", el: "Αυτή η εικόνα εμφανίζεται ως φόντο για το τμήμα 'Επερχόμενες Εκδηλώσεις' στην αρχική σελίδα" }}</TranslatableText>
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <ImageUpload
              value={settings.eventsSectionImage}
              onChange={updateEventsSectionImage}
              folder="events-section"
              label=""
              aspectRatio={16/9}
              recommendedDimensions={{ width: 1200, height: 675 }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Museums Section Background Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              <TranslatableText>{{ en: "Museums Section Background", el: "Φόντο Τμήματος Μουσείων" }}</TranslatableText>
            </CardTitle>
            <p className="text-gray-600 text-sm">
              <TranslatableText>{{ en: "This image appears as the background for the 'Museums and Places' section on the homepage", el: "Αυτή η εικόνα εμφανίζεται ως φόντο για το τμήμα 'Μουσεία και Χώροι' στην αρχική σελίδα" }}</TranslatableText>
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <ImageUpload
              value={settings.museumsSectionImage}
              onChange={updateMuseumsSectionImage}
              folder="museums-section"
              label=""
              aspectRatio={16/9}
              recommendedDimensions={{ width: 1200, height: 1080 }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Navigation Ordering */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <GripVertical className="w-5 h-5 text-purple-600" />
              <TranslatableText>{{ en: "Main Navigation Order", el: "Σειρά Κύριας Πλοήγησης" }}</TranslatableText>
            </CardTitle>
            <p className="text-gray-600 text-sm">
              <TranslatableText>{{ en: "Drag and drop to reorder the main navigation items. Changes will be reflected in the navbar.", el: "Σύρετε και αφήστε για να αλλάξετε τη σειρά των κύριων στοιχείων πλοήγησης. Οι αλλαγές θα εμφανιστούν στη γραμμή πλοήγησης." }}</TranslatableText>
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                <TranslatableText>{{ en: "Drag the items below to change their order in the main navigation bar:", el: "Σύρετε τα στοιχεία παρακάτω για να αλλάξετε τη σειρά τους στη κύρια γραμμή πλοήγησης:" }}</TranslatableText>
              </p>
              
              <Reorder.Group 
                axis="y" 
                values={settings.mainNavigationOrder} 
                onReorder={(newOrder) => setSettings(prev => ({ ...prev, mainNavigationOrder: newOrder }))}
                className="space-y-2"
              >
                {settings.mainNavigationOrder.map((item) => (
                  <Reorder.Item key={item} value={item} className="cursor-move">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 capitalize">
                          {item === 'home' && <TranslatableText>Home</TranslatableText>}
                          {item === 'news' && <TranslatableText>News</TranslatableText>}
                          {item === 'events' && <TranslatableText>Events</TranslatableText>}
                          {item === 'contact' && <TranslatableText>Contact</TranslatableText>}
                          {item === 'museums' && <TranslatableText>Museums</TranslatableText>}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">({item})</span>
                      </div>
                      <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        <TranslatableText>Drag to reorder</TranslatableText>
                      </div>
                    </motion.div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
              

            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-end"
      >
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={saving}
          className="px-6 py-3"
        >
          <TranslatableText>{{ en: "Reset to Default", el: "Επαναφορά στις Προεπιλογές" }}</TranslatableText>
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        >
          {saving ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <TranslatableText>{{ en: "Saving...", el: "Αποθήκευση..." }}</TranslatableText>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              <TranslatableText>{{ en: "Save Changes", el: "Αποθήκευση Αλλαγών" }}</TranslatableText>
            </div>
          )}
        </Button>
      </motion.div>

      {/* Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
            <CardTitle className="text-xl">
              <TranslatableText>{{ en: "Preview", el: "Προεπισκόπηση" }}</TranslatableText>
            </CardTitle>
            <p className="text-gray-600 text-sm">
              <TranslatableText>{{ en: "See how your changes will look on the website", el: "Δείτε πώς θα φαίνονται οι αλλαγές σας στην ιστοσελίδα" }}</TranslatableText>
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hero Images Preview */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">
                  <TranslatableText>{{ en: "Hero Images", el: "Εικόνες Hero" }}</TranslatableText>
                </h4>
                <div className="space-y-3">
                  {settings.heroImages.image1 && (
                    <div className="relative">
                      <img
                        src={settings.heroImages.image1}
                        alt="Hero 1 Preview"
                        className="w-full h-32 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.jpg';
                        }}
                      />
                      <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        <TranslatableText>{{ en: "Image 1", el: "Εικόνα 1" }}</TranslatableText>
                      </span>
                    </div>
                  )}
                  {settings.heroImages.image2 && (
                    <div className="relative">
                      <img
                        src={settings.heroImages.image2}
                        alt="Hero 2 Preview"
                        className="w-full h-32 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.jpg';
                        }}
                      />
                      <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        <TranslatableText>{{ en: "Image 2", el: "Εικόνα 2" }}</TranslatableText>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Explore Town Image Preview */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">
                  <TranslatableText>{{ en: "Explore Town Image", el: "Εικόνα Εξερευνήστε την Πόλη" }}</TranslatableText>
                </h4>
                {settings.exploreTownImage && (
                  <div className="relative">
                    <img
                      src={settings.exploreTownImage}
                      alt="Explore Town Preview"
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Events Section Background Preview */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">
                  <TranslatableText>{{ en: "Events Section Background", el: "Φόντο Τμήματος Εκδηλώσεων" }}</TranslatableText>
                </h4>
                {settings.eventsSectionImage && (
                  <div className="relative">
                    <img
                      src={settings.eventsSectionImage}
                      alt="Events Section Background Preview"
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Museums Section Background Preview */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">
                  <TranslatableText>{{ en: "Museums Section Background", el: "Φόντο Τμήματος Μουσείων" }}</TranslatableText>
                </h4>
                {settings.museumsSectionImage && (
                  <div className="relative">
                    <img
                      src={settings.museumsSectionImage}
                      alt="Museums Section Background Preview"
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}