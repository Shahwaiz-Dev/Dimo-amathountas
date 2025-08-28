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
import { Separator } from '@/components/ui/separator';
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
  Tag,
  ArrowUp,
  ArrowDown
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
    order: number;
    // New fields for enhanced category system
    parentCategory?: string;
    showInNavbar: boolean;
    navOrder: number;
    slug: string;
  }>({
    name: { en: '', el: '' },
    description: { en: '', el: '' },
    icon: 'file-text',
    color: 'blue',
    isActive: true,
    order: 0,
    parentCategory: '',
    showInNavbar: false,
    navOrder: 0,
    slug: '',
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
      order: 0,
      parentCategory: '',
      showInNavbar: false,
      navOrder: 0,
      slug: '',
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
      order: category.order || 0,
      parentCategory: category.parentCategory || '',
      showInNavbar: (category as any).showInNavbar ?? false,
      navOrder: (category as any).navOrder || 0,
      slug: (category as any).slug || '',
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
    
    try {
      if (editingCategory) {
        await updatePageCategory(editingCategory.id, formData);
        toast({
          title: currentLang === 'el' ? "Επιτυχία" : "Success",
          description: currentLang === 'el' ? "Η κατηγορία ενημερώθηκε επιτυχώς" : "Category updated successfully",
        });
      } else {
        await addPageCategory(formData);
        toast({
          title: currentLang === 'el' ? "Επιτυχία" : "Success",
          description: currentLang === 'el' ? "Η κατηγορία δημιουργήθηκε επιτυχώς" : "Category created successfully",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      loadCategories();
    } catch (error) {
      toast({
        title: currentLang === 'el' ? "Σφάλμα" : "Error",
        description: currentLang === 'el' ? "Αποτυχία αποθήκευσης κατηγορίας" : "Failed to save category",
        variant: "destructive",
      });
    }
  };

  const moveCategory = async (id: string, direction: 'up' | 'down') => {
    try {
      const currentIndex = categories.findIndex(cat => cat.id === id);
      if (currentIndex === -1) return;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= categories.length) return;

      const currentCategory = categories[currentIndex];
      const targetCategory = categories[newIndex];

      // Swap orders
      const tempOrder = currentCategory.order;
      currentCategory.order = targetCategory.order;
      targetCategory.order = tempOrder;

      // Update both categories
      await Promise.all([
        updatePageCategory(currentCategory.id, currentCategory),
        updatePageCategory(targetCategory.id, targetCategory)
      ]);

      toast({
        title: currentLang === 'el' ? "Επιτυχία" : "Success",
        description: currentLang === 'el' ? "Η σειρά κατηγορίας ενημερώθηκε" : "Category order updated",
      });
      
      loadCategories();
    } catch (error) {
      toast({
        title: currentLang === 'el' ? "Σφάλμα" : "Error",
        description: currentLang === 'el' ? "Αποτυχία ενημέρωσης σειράς κατηγορίας" : "Failed to update category order",
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
          <h2 className="text-xl font-bold">
            <TranslatableText>{{ en: 'Page Categories', el: 'Κατηγορίες Σελίδων' }}</TranslatableText>
          </h2>
          <Button 
            onClick={() => {
              setFormData({ ...formData, order: categories.length });
              setIsDialogOpen(true);
            }}
            className="bg-primary text-white font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            <TranslatableText>{{ en: 'Create Category', el: 'Δημιουργία Κατηγορίας' }}</TranslatableText>
          </Button>
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
                    setFormData({ ...formData, order: 0 });
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
                        <div className="flex flex-col space-y-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveCategory(category.id, 'up')}
                            disabled={index === 0}
                            className="h-6 w-6 p-0"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveCategory(category.id, 'down')}
                            disabled={index === categories.length - 1}
                            className="h-6 w-6 p-0"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                        
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
                            <Badge variant="outline">
                              <TranslatableText>{{ en: 'Order', el: 'Σειρά' }}</TranslatableText>: {category.order}
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
      </div>

      {/* Create/Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? (
                <TranslatableText>{{ en: 'Edit Category', el: 'Επεξεργασία Κατηγορίας' }}</TranslatableText>
              ) : (
                <TranslatableText>{{ en: 'Create New Category', el: 'Δημιουργία Νέας Κατηγορίας' }}</TranslatableText>
              )}
            </DialogTitle>
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

            {/* Order */}
            <div>
              <Label htmlFor="order" className="text-sm font-medium">
                <TranslatableText>{{ en: 'Display Order', el: 'Σειρά Εμφάνισης' }}</TranslatableText>
              </Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="mt-1"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                <TranslatableText>{{ en: 'Lower numbers appear first in the list', el: 'Οι μικρότεροι αριθμοί εμφανίζονται πρώτοι στη λίστα' }}</TranslatableText>
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
            </div>

            {/* Enhanced Category Settings */}
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                <TranslatableText>{{ en: 'Advanced Settings', el: 'Προηγμένες Ρυθμίσεις' }}</TranslatableText>
              </h3>
              
              {/* Parent Category */}
              <div>
                <Label htmlFor="parentCategory" className="text-sm font-medium">
                  <TranslatableText>{{ en: 'Parent Category', el: 'Γονική Κατηγορία' }}</TranslatableText>
                </Label>
                <Select
                  value={formData.parentCategory || ''}
                  onValueChange={(value) => setFormData({ ...formData, parentCategory: value || undefined })}
                >
                  <SelectTrigger id="parentCategory" className="mt-1">
                    <SelectValue placeholder={currentLang === 'el' ? 'Επιλέξτε γονική κατηγορία (προαιρετικό)' : 'Select parent category (optional)'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
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
                  <TranslatableText>{{ en: 'Leave empty to create a top-level category', el: 'Αφήστε κενό για να δημιουργήσετε κατηγορία επάνω επιπέδου' }}</TranslatableText>
                </p>
              </div>

              {/* Slug */}
              <div>
                <Label htmlFor="slug" className="text-sm font-medium">
                  <TranslatableText>{{ en: 'URL Slug', el: 'URL Slug' }}</TranslatableText>
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder={currentLang === 'el' ? 'Εισάγετε το URL slug' : 'Enter URL slug'}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  <TranslatableText>{{ en: 'URL-friendly version of the category name (e.g., "citizen-services")', el: 'Φιλικό προς URL έκδοση του ονόματος της κατηγορίας (π.χ., "υπηρεσίες-πολιτών")' }}</TranslatableText>
                </p>
              </div>

              {/* Navbar Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showInNavbar"
                    checked={formData.showInNavbar}
                    onCheckedChange={(checked) => setFormData({ ...formData, showInNavbar: checked })}
                  />
                  <Label htmlFor="showInNavbar" className="text-sm font-medium">
                    <TranslatableText>{{ en: 'Show in Navbar', el: 'Εμφάνιση στη Γραμμή Πλοήγησης' }}</TranslatableText>
                  </Label>
                </div>
                
                <div>
                  <Label htmlFor="navOrder" className="text-sm font-medium">
                    <TranslatableText>{{ en: 'Navbar Order', el: 'Σειρά στη Γραμμή Πλοήγησης' }}</TranslatableText>
                  </Label>
                  <Input
                    id="navOrder"
                    type="number"
                    value={formData.navOrder}
                    onChange={(e) => setFormData({ ...formData, navOrder: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="mt-1"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    <TranslatableText>{{ en: 'Lower numbers appear first in navbar', el: 'Οι μικρότεροι αριθμοί εμφανίζονται πρώτοι στη γραμμή πλοήγησης' }}</TranslatableText>
                  </p>
                </div>
              </div>
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