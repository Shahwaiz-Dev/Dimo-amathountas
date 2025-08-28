'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Building,
  Users,
  Settings,
  Heart,
  FileText,
  Tag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getPageCategories, 
  addPageCategory, 
  updatePageCategory, 
  deletePageCategory,
  PageCategory
} from '@/lib/firestore';
import { TranslatableText } from '@/components/translatable-content';
import { HeartbeatLoader } from '@/components/ui/heartbeat-loader';
import { useTranslation } from '@/hooks/useTranslation';

const CATEGORY_ICONS = [
  { value: 'building', label: { en: 'Building', el: 'Κτίριο' }, icon: Building },
  { value: 'users', label: { en: 'Users', el: 'Χρήστες' }, icon: Users },
  { value: 'settings', label: { en: 'Settings', el: 'Ρυθμίσεις' }, icon: Settings },
  { value: 'heart', label: { en: 'Heart', el: 'Καρδιά' }, icon: Heart },
  { value: 'file-text', label: { en: 'File Text', el: 'Κείμενο Αρχείου' }, icon: FileText },
  { value: 'tag', label: { en: 'Tag', el: 'Ετικέτα' }, icon: Tag },
];

const CATEGORY_COLORS = [
  { value: 'blue', label: { en: 'Blue', el: 'Μπλε' }, class: 'bg-blue-100 text-blue-600' },
  { value: 'green', label: { en: 'Green', el: 'Πράσινο' }, class: 'bg-green-100 text-green-600' },
  { value: 'purple', label: { en: 'Purple', el: 'Μωβ' }, class: 'bg-purple-100 text-purple-600' },
  { value: 'pink', label: { en: 'Pink', el: 'Ροζ' }, class: 'bg-pink-100 text-pink-600' },
  { value: 'orange', label: { en: 'Orange', el: 'Πορτοκαλί' }, class: 'bg-orange-100 text-orange-600' },
  { value: 'red', label: { en: 'Red', el: 'Κόκκινο' }, class: 'bg-red-100 text-red-600' },
  { value: 'gray', label: { en: 'Gray', el: 'Γκρι' }, class: 'bg-gray-100 text-gray-600' },
];

export function PageCategoriesManagement() {
  const [categories, setCategories] = useState<PageCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PageCategory | null>(null);
  const { toast } = useToast();
  const { currentLang } = useTranslation();
  const [formData, setFormData] = useState<{
    name: { en: string; el: string };
    description: { en: string; el: string };
    icon: string;
    color: string;
    isActive: boolean;
    parentCategory?: string | 'none';
    showInNavbar: boolean;
  }>({
    name: { en: '', el: '' },
    description: { en: '', el: '' },
    icon: 'file-text',
    color: 'blue',
    isActive: true,
    parentCategory: 'none',
    showInNavbar: true, // Changed to true by default
  });



  const loadCategories = useCallback(async () => {
    try {
      const fetchedCategories = await getPageCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: currentLang === 'el' ? "Σφάλμα" : "Error",
        description: currentLang === 'el' ? "Αποτυχία φόρτωσης κατηγοριών" : "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, currentLang]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const resetForm = () => {
    setFormData({
      name: { en: '', el: '' },
      description: { en: '', el: '' },
      icon: 'file-text',
      color: 'blue',
      isActive: true,
      parentCategory: 'none',
      showInNavbar: true, // Changed to true by default
    });
    setEditingCategory(null);
  };

  const handleEdit = (category: PageCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || { en: '', el: '' },
      icon: category.icon || 'file-text',
      color: category.color || 'blue',
      isActive: category.isActive ?? true,
      parentCategory: category.parentCategory || 'none',
      showInNavbar: category.showInNavbar ?? true, // Fixed: preserve existing value or default to true
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm(currentLang === 'el' ? 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την κατηγορία;' : 'Are you sure you want to delete this category?')) {
      try {
        await deletePageCategory(id);
        toast({
          title: currentLang === 'el' ? "Επιτυχία" : "Success",
          description: currentLang === 'el' ? "Η κατηγορία διαγράφηκε επιτυχώς" : "Category deleted successfully",
        });
        loadCategories();
      } catch (error) {
        toast({
          title: currentLang === 'el' ? "Σφάλμα" : "Error",
          description: currentLang === 'el' ? "Αποτυχία διαγραφής κατηγορίας" : "Failed to delete category",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started:', formData); // Debug log
    
    // Basic validation
    if (!formData.name.en.trim() || !formData.name.el.trim()) {
      toast({
        title: currentLang === 'el' ? "Σφάλμα" : "Error",
        description: currentLang === 'el' ? "Παρακαλώ συμπληρώστε το όνομα της κατηγορίας και στα αγγλικά και στα ελληνικά" : "Please fill in the category name in both English and Greek",
        variant: "destructive",
      });
      return;
    }
    
    // Validate navbar category limit
    if (formData.showInNavbar && !editingCategory) {
      const currentNavbarCategories = categories.filter(cat => cat.showInNavbar);
      if (currentNavbarCategories.length >= 10) {
        toast({
          title: currentLang === 'el' ? "Σφάλμα" : "Error",
          description: currentLang === 'el' ? "Δεν μπορείτε να δημιουργήσετε περισσότερες από 10 κατηγορίες στη γραμμή πλοήγησης" : "Cannot create more than 10 navbar categories",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      // Prepare data for submission, converting 'none' to undefined for parentCategory
      const submissionData = {
        ...formData,
        parentCategory: formData.parentCategory === 'none' ? undefined : formData.parentCategory
      };

      console.log('Submitting data:', submissionData); // Debug log

      if (editingCategory) {
        console.log('Updating category:', editingCategory.id); // Debug log
        await updatePageCategory(editingCategory.id, submissionData);
        toast({
          title: currentLang === 'el' ? "Επιτυχία" : "Success",
          description: currentLang === 'el' ? "Η κατηγορία ενημερώθηκε επιτυχώς" : "Category updated successfully",
        });
      } else {
        console.log('Creating new category'); // Debug log
        const newCategoryId = await addPageCategory(submissionData);
        console.log('New category created with ID:', newCategoryId); // Debug log
        toast({
          title: currentLang === 'el' ? "Επιτυχία" : "Success",
          description: currentLang === 'el' ? "Η κατηγορία δημιουργήθηκε επιτυχώς" : "Category created successfully",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      loadCategories();
    } catch (error) {
      console.error('Error in handleSubmit:', error); // Debug log
      toast({
        title: currentLang === 'el' ? "Σφάλμα" : "Error",
        description: currentLang === 'el' ? "Αποτυχία αποθήκευσης κατηγορίας" : "Failed to save category",
        variant: "destructive",
      });
    }
  };



  const getIconComponent = (iconName: string) => {
    const iconConfig = CATEGORY_ICONS.find(icon => icon.value === iconName);
    return iconConfig ? iconConfig.icon : FileText;
  };

  const getColorClass = (colorName: string) => {
    const colorConfig = CATEGORY_COLORS.find(color => color.value === colorName);
    return colorConfig ? colorConfig.class : 'bg-gray-100 text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <HeartbeatLoader size="md" className="mx-auto mb-4" />
          <p className="text-muted-foreground">
            <TranslatableText>{{ en: 'Loading categories...', el: 'Φόρτωση κατηγοριών...' }}</TranslatableText>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Categories Management Section */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">
              <TranslatableText>{{ en: 'Page Categories', el: 'Κατηγορίες Σελίδων' }}</TranslatableText>
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              <TranslatableText>{{ en: 'Maximum 10 categories can be shown in the navbar', el: 'Μέγιστο 10 κατηγορίες μπορούν να εμφανιστούν στη γραμμή πλοήγησης' }}</TranslatableText>
            </p>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline" className="text-xs">
                <TranslatableText>{{ en: 'Navbar Categories', el: 'Κατηγορίες Γραμμής Πλοήγησης' }}</TranslatableText>: {categories.filter(cat => cat.showInNavbar).length}/10
              </Badge>
              <Badge variant="outline" className="text-xs">
                <TranslatableText>{{ en: 'Total Categories', el: 'Συνολικές Κατηγορίες' }}</TranslatableText>: {categories.length}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                setFormData({ ...formData, parentCategory: 'none' });
                setIsDialogOpen(true);
              }}
              className="bg-primary text-white font-semibold"
              disabled={categories.filter(cat => cat.showInNavbar).length >= 10}
            >
              <Plus className="h-4 w-4 mr-2" />
              <TranslatableText>{{ en: 'Create Category', el: 'Δημιουργία Κατηγορίας' }}</TranslatableText>
            </Button>
            <Button 
              onClick={() => {
                // This will open the form, user needs to select parent category
                setFormData({ ...formData, parentCategory: 'none' });
                setIsDialogOpen(true);
              }}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              <TranslatableText>{{ en: 'Create Subcategory', el: 'Δημιουργία Υποκατηγορίας' }}</TranslatableText>
            </Button>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-4">
          {categories.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Tag className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  <TranslatableText>{{ en: 'No categories found', el: 'Δεν βρέθηκαν κατηγορίες' }}</TranslatableText>
                </h3>
                <p className="text-gray-500 mb-4">
                  <TranslatableText>{{ en: 'Get started by creating your first page category.', el: 'Ξεκινήστε δημιουργώντας την πρώτη σας κατηγορία σελίδων.' }}</TranslatableText>
                </p>
                <Button 
                  onClick={() => {
                    setFormData({ ...formData, parentCategory: 'none' });
                    setIsDialogOpen(true);
                  }}
                  className="bg-primary text-white font-semibold"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <TranslatableText>{{ en: 'Create Category', el: 'Δημιουργία Κατηγορίας' }}</TranslatableText>
                </Button>
              </CardContent>
            </Card>
          ) : (
            categories.map((category, index) => {
              const IconComponent = getIconComponent(category.icon || 'file-text');
              const colorClass = getColorClass(category.color || 'blue');
              
              return (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">

                        
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-lg">
                              <TranslatableText>{category.name}</TranslatableText>
                            </h3>
                            <Badge variant={category.isActive ? "default" : "secondary"}>
                              {category.isActive ? (
                                <TranslatableText>{{ en: 'Active', el: 'Ενεργή' }}</TranslatableText>
                              ) : (
                                <TranslatableText>{{ en: 'Inactive', el: 'Ανενεργή' }}</TranslatableText>
                              )}
                            </Badge>

                            {category.showInNavbar && (
                              <Badge variant="default" className="bg-green-100 text-green-600">
                                <TranslatableText>{{ en: 'Navbar', el: 'Γραμμή Πλοήγησης' }}</TranslatableText>
                              </Badge>
                            )}
                            {category.parentCategory && (
                              <Badge variant="secondary">
                                <TranslatableText>{{ en: 'Subcategory', el: 'Υποκατηγορία' }}</TranslatableText>
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {category.description ? (
                              <TranslatableText>{category.description}</TranslatableText>
                            ) : (
                              <TranslatableText>{{ en: 'No description', el: 'Δεν υπάρχει περιγραφή' }}</TranslatableText>
                            )}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>
                              {currentLang === 'el' ? 'English' : 'Ελληνικά'}: {currentLang === 'el' ? (category.name.en || '') : (category.name.el || '')}
                            </span>
                            {category.description?.el && (
                              <span>• {currentLang === 'el' ? (category.description.en || '') : (category.description.el || '')}</span>
                            )}
                            {(category as any).slug && (
                              <span>• Slug: {(category as any).slug}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              parentCategory: category.id,
                              showInNavbar: false, // Subcategories don't show in navbar by default
                            });
                            setIsDialogOpen(true);
                          }}
                          className="text-green-600 hover:text-green-700"
                          title={currentLang === 'el' ? 'Δημιουργία υποκατηγορίας' : 'Create subcategory'}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
        
        {/* How to Create Pages Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            <TranslatableText>{{ en: 'How to Create Pages', el: 'Πώς να Δημιουργήσετε Σελίδες' }}</TranslatableText>
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              <TranslatableText>{{ en: '1. First, create categories and subcategories here', el: '1. Πρώτα, δημιουργήστε κατηγορίες και υποκατηγορίες εδώ' }}</TranslatableText>
            </p>
            <p>
              <TranslatableText>{{ en: '2. Then go to Admin > Municipality Pages to create pages for your categories', el: '2. Μετά πηγαίνετε στο Admin > Municipality Pages για να δημιουργήσετε σελίδες για τις κατηγορίες σας' }}</TranslatableText>
            </p>
            <p>
              <TranslatableText>{{ en: '3. When creating a page, select the appropriate category from the dropdown', el: '3. Όταν δημιουργείτε μια σελίδα, επιλέξτε την κατάλληλη κατηγορία από το dropdown' }}</TranslatableText>
            </p>
            <p>
              <TranslatableText>{{ en: '4. Pages will automatically appear under their respective categories in the navbar', el: '4. Οι σελίδες θα εμφανιστούν αυτόματα κάτω από τις αντίστοιχες κατηγορίες στη γραμμή πλοήγησης' }}</TranslatableText>
            </p>
            <div className="mt-3 p-3 bg-white rounded border">
              <p className="text-xs text-gray-600">
                <TranslatableText>{{ en: '💡 Tip: You can also create categories directly from the Municipality Pages section, but for better organization, we recommend using this dedicated Categories page.', el: '💡 Συμβουλή: Μπορείτε επίσης να δημιουργήσετε κατηγορίες απευθείας από την ενότητα Σελίδες Δήμου, αλλά για καλύτερη οργάνωση, προτείνουμε τη χρήση αυτής της αφιερωμένης σελίδας Κατηγοριών.' }}</TranslatableText>
              </p>
            </div>
          </div>
        </div>
        
        {/* Debug Section - Navbar Categories */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">
            <TranslatableText>{{ en: 'Debug: Navbar Categories Status', el: 'Debug: Κατάσταση Κατηγοριών Γραμμής Πλοήγησης' }}</TranslatableText>
          </h3>
          <div className="text-sm text-yellow-800 space-y-2">
            <p>
              <TranslatableText>{{ en: 'Categories that should appear in navbar:', el: 'Κατηγορίες που θα πρέπει να εμφανιστούν στη γραμμή πλοήγησης:' }}</TranslatableText>
            </p>
            <div className="bg-white p-3 rounded border text-xs">
              {categories
                .filter(cat => cat.showInNavbar)
                .map(cat => (
                  <div key={cat.id} className="mb-2 p-2 bg-gray-50 rounded">
                    <strong>{cat.name.en}</strong> - 
                    Active: {cat.isActive ? 'Yes' : 'No'}
                  </div>
                ))}
              {categories.filter(cat => cat.showInNavbar).length === 0 && (
                <p className="text-gray-500 italic">
                  <TranslatableText>{{ en: 'No categories are set to show in navbar', el: 'Δεν υπάρχουν κατηγορίες που να έχουν ρυθμιστεί για εμφάνιση στη γραμμή πλοήγησης' }}</TranslatableText>
                </p>
              )}
            </div>
            
            {/* Test Button */}
            <div className="mt-4">
              <Button 
                onClick={() => {
                  console.log('Current form data:', formData);
                  console.log('Current categories:', categories);
                  console.log('Categories with showInNavbar:', categories.filter(cat => cat.showInNavbar));
                }}
                variant="outline"
                size="sm"
                className="mr-2"
              >
                <TranslatableText>{{ en: 'Debug: Log Current State', el: 'Debug: Καταγραφή Τρέχουσας Κατάστασης' }}</TranslatableText>
              </Button>
              
              <Button 
                onClick={async () => {
                  try {
                    console.log('Testing category creation...');
                    const testData = {
                      name: { en: 'Test Category', el: 'Δοκιμαστική Κατηγορία' },
                      description: { en: 'Test Description', el: 'Δοκιμαστική Περιγραφή' },
                      icon: 'file-text',
                      color: 'blue',
                      isActive: true,
                      showInNavbar: true
                    };
                    console.log('Test data:', testData);
                    const result = await addPageCategory(testData);
                    console.log('Test category created with ID:', result);
                    toast({
                      title: "Test Success",
                      description: `Test category created with ID: ${result}`,
                    });
                    loadCategories(); // Refresh the list
                  } catch (error) {
                    console.error('Test category creation failed:', error);
                    toast({
                      title: "Test Failed",
                      description: `Error: ${error}`,
                      variant: "destructive",
                    });
                  }
                }}
                variant="outline"
                size="sm"
                className="bg-green-100 text-green-700 hover:bg-green-200"
              >
                <TranslatableText>{{ en: 'Test: Create Sample Category', el: 'Test: Δημιουργία Δοκιμαστικής Κατηγορίας' }}</TranslatableText>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? (
                <TranslatableText>{{ en: 'Edit Category', el: 'Επεξεργασία Κατηγορίας' }}</TranslatableText>
              ) : formData.parentCategory && formData.parentCategory !== 'none' ? (
                <TranslatableText>{{ en: 'Create New Subcategory', el: 'Δημιουργία Νέας Υποκατηγορίας' }}</TranslatableText>
              ) : (
                <TranslatableText>{{ en: 'Create New Category', el: 'Δημιουργία Νέας Κατηγορίας' }}</TranslatableText>
              )}
            </DialogTitle>
            {!editingCategory && formData.parentCategory && formData.parentCategory !== 'none' && (
              <p className="text-sm text-gray-600 mt-2">
                <TranslatableText>{{ en: 'You are creating a subcategory. The parent category is already selected.', el: 'Δημιουργείτε μια υποκατηγορία. Η γονική κατηγορία έχει ήδη επιλεγεί.' }}</TranslatableText>
              </p>
            )}
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name-en" className="text-sm font-medium">
                  <TranslatableText>{{ en: 'Name (English)', el: 'Όνομα (Αγγλικά)' }}</TranslatableText>
                </Label>
                <Input
                  id="name-en"
                  value={formData.name.en}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                  placeholder={currentLang === 'el' ? 'Εισάγετε το όνομα της κατηγορίας στα αγγλικά' : 'Enter category name in English'}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="name-el" className="text-sm font-medium">
                  <TranslatableText>{{ en: 'Name (Greek)', el: 'Όνομα (Ελληνικά)' }}</TranslatableText>
                </Label>
                <Input
                  id="name-el"
                  value={formData.name.el}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name, el: e.target.value } })}
                  placeholder={currentLang === 'el' ? 'Εισάγετε το όνομα της κατηγορίας στα ελληνικά' : 'Enter category name in Greek'}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="description-en" className="text-sm font-medium">
                  <TranslatableText>{{ en: 'Description (English)', el: 'Περιγραφή (Αγγλικά)' }}</TranslatableText>
                </Label>
                <Textarea
                  id="description-en"
                  value={formData.description.en}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                  placeholder={currentLang === 'el' ? 'Εισάγετε την περιγραφή της κατηγορίας στα αγγλικά' : 'Enter category description in English'}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="description-el" className="text-sm font-medium">
                  <TranslatableText>{{ en: 'Description (Greek)', el: 'Περιγραφή (Ελληνικά)' }}</TranslatableText>
                </Label>
                <Textarea
                  id="description-el"
                  value={formData.description.el}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, el: e.target.value } })}
                  placeholder={currentLang === 'el' ? 'Εισάγετε την περιγραφή της κατηγορίας στα ελληνικά' : 'Enter category description in Greek'}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            {/* Icon and Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="icon" className="text-sm font-medium">
                  <TranslatableText>{{ en: 'Icon', el: 'Εικονίδιο' }}</TranslatableText>
                </Label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) => setFormData({ ...formData, icon: value })}
                >
                  <SelectTrigger id="icon" className="mt-1">
                    <SelectValue placeholder={currentLang === 'el' ? 'Επιλέξτε ένα εικονίδιο' : 'Select an icon'} />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_ICONS.map((icon) => {
                      const IconComponent = icon.icon;
                      return (
                        <SelectItem key={icon.value} value={icon.value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <span>{icon.label[currentLang as keyof typeof icon.label] || icon.label.en || ''}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="color" className="text-sm font-medium">
                  <TranslatableText>{{ en: 'Color', el: 'Χρώμα' }}</TranslatableText>
                </Label>
                <Select
                  value={formData.color}
                  onValueChange={(value) => setFormData({ ...formData, color: value })}
                >
                  <SelectTrigger id="color" className="mt-1">
                    <SelectValue placeholder={currentLang === 'el' ? 'Επιλέξτε ένα χρώμα' : 'Select a color'} />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_COLORS.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${color.class.split(' ')[0]}`}></div>
                          <span>{color.label[currentLang as keyof typeof color.label] || color.label.en || ''}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Simple Settings */}
            <div className="space-y-4">
              {/* Parent Category */}
              <div>
                <Label htmlFor="parentCategory" className="text-sm font-medium">
                  <TranslatableText>{{ en: 'Parent Category (Optional)', el: 'Γονική Κατηγορία (Προαιρετικό)' }}</TranslatableText>
                </Label>
                <Select
                  value={formData.parentCategory || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, parentCategory: value === 'none' ? undefined : value })}
                >
                  <SelectTrigger id="parentCategory" className="mt-1">
                    <SelectValue placeholder={currentLang === 'el' ? 'Επιλέξτε γονική κατηγορία (προαιρετικό)' : 'Select parent category (optional)'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <TranslatableText>{{ en: 'No Parent (Top Level)', el: 'Χωρίς Γονική (Επάνω Επίπεδο)' }}</TranslatableText>
                    </SelectItem>
                    {categories
                      .filter(cat => cat.id !== editingCategory?.id && cat.isActive)
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <TranslatableText>{category.name}</TranslatableText>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  <TranslatableText>{{ en: 'Select a parent category to create a subcategory', el: 'Επιλέξτε γονική κατηγορία για να δημιουργήσετε υποκατηγορία' }}</TranslatableText>
                </p>
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive" className="text-sm font-medium">
                  <TranslatableText>{{ en: 'Active', el: 'Ενεργή' }}</TranslatableText>
                </Label>
                <span className="text-xs text-gray-500">
                  <TranslatableText>{{ en: 'Enable or disable this category', el: 'Ενεργοποίηση ή απενεργοποίηση αυτής της κατηγορίας' }}</TranslatableText>
                </span>
              </div>

              {/* Show in Navbar */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="showInNavbar"
                  checked={formData.showInNavbar}
                  onCheckedChange={(checked) => setFormData({ ...formData, showInNavbar: checked })}
                  disabled={!formData.showInNavbar && categories.filter(cat => cat.showInNavbar).length >= 10}
                />
                <Label htmlFor="showInNavbar" className="text-sm font-medium">
                  <TranslatableText>{{ en: 'Show in Navbar', el: 'Εμφάνιση στη Γραμμή Πλοήγησης' }}</TranslatableText>
                </Label>
                <span className="text-xs text-gray-500">
                  ({categories.filter(cat => cat.showInNavbar).length}/10)
                </span>
              </div>
              
              {/* Navbar Limit Warning */}
              {!formData.showInNavbar && categories.filter(cat => cat.showInNavbar).length >= 10 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        <TranslatableText>{{ en: 'Navbar Limit Reached', el: 'Έφτασε το Όριο Γραμμής Πλοήγησης' }}</TranslatableText>
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          <TranslatableText>{{ en: 'You have reached the maximum of 10 navbar categories. Disable another category first to enable this one.', el: 'Έχετε φτάσει στο μέγιστο των 10 κατηγοριών γραμμής πλοήγησης. Απενεργοποιήστε πρώτα μια άλλη κατηγορία για να ενεργοποιήσετε αυτή.' }}</TranslatableText>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                <TranslatableText>{{ en: 'Cancel', el: 'Ακύρωση' }}</TranslatableText>
              </Button>
              <Button type="submit" className="bg-primary text-white">
                {editingCategory ? (
                  <TranslatableText>{{ en: 'Update Category', el: 'Ενημέρωση Κατηγορίας' }}</TranslatableText>
                ) : (
                  <TranslatableText>{{ en: 'Create Category', el: 'Δημιουργία Κατηγορίας' }}</TranslatableText>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 