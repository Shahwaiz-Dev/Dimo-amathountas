'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Calendar,
  Building,
  User,
  Users,
  FileText,
  Heart,
  AlertCircle,
  Settings,
  HandHeart,
  Briefcase,
  Tag,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getAllMunicipalityPages, 
  createMunicipalityPage, 
  updateMunicipalityPage, 
  deleteMunicipalityPage,
  MunicipalityPage,
  getPageCategories,
  addPageCategory,
  updatePageCategory,
  deletePageCategory,
  PageCategory
} from '@/lib/firestore';
import { ImageUpload } from '@/components/ui/image-upload';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { TranslatableText } from '@/components/translatable-content';
import { HeartbeatLoader } from '@/components/ui/heartbeat-loader';
import { MunicipalityPageContent } from '@/components/municipality/municipality-page-content';
import { useTranslation } from '@/hooks/useTranslation';

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'building':
      return <Building className="h-4 w-4" />;
    case 'users':
      return <Users className="h-4 w-4" />;
    case 'settings':
      return <Settings className="h-4 w-4" />;
    case 'heart':
      return <Heart className="h-4 w-4" />;
    case 'tag':
      return <Tag className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getCategoryColor = (colorName: string) => {
  switch (colorName) {
    case 'blue':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'green':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'purple':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'pink':
      return 'bg-pink-100 text-pink-800 border-pink-200';
    case 'orange':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'red':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

type LayoutType = 'layout1' | 'layout2' | 'layout3';

export function PagesManagement() {
  const [pages, setPages] = useState<MunicipalityPage[]>([]);
  const [categories, setCategories] = useState<PageCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<MunicipalityPage | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const { toast } = useToast();
  const { currentLang } = useTranslation();

  const [showCategoriesDialog, setShowCategoriesDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PageCategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<{
    name: { en: string; el: string };
    description: { en: string; el: string };
    icon: string;
    color: string;
    isActive: boolean;
    order: number;
  }>({
    name: { en: '', el: '' },
    description: { en: '', el: '' },
    icon: 'file-text',
    color: 'blue',
    isActive: true,
    order: 0,
  });
  const [formData, setFormData] = useState<{
    slug: string;
    title: { en: string; el: string };
    content: { en: string; el: string };
    excerpt: { en: string; el: string };
    imageUrl: string;
    category: string;
    isPublished: boolean;
    layout: LayoutType;
  }>({
    slug: '',
    title: { en: '', el: '' },
    content: { en: '', el: '' },
    excerpt: { en: '', el: '' },
    imageUrl: '',
    category: '',
    isPublished: true,
    layout: 'layout1',
  });

  const loadPages = useCallback(async () => {
    try {
      const [fetchedPages, fetchedCategories] = await Promise.all([
        getAllMunicipalityPages(),
        getPageCategories()
      ]);
      setPages(fetchedPages);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error loading pages:', error);
      toast({
        title: "Error",
        description: "Failed to load pages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  // Update selectedCategory if URL changes (e.g., via sidebar)
  useEffect(() => {
    const urlCategory = searchParams?.get('category') || 'all';
    setSelectedCategory(urlCategory);
  }, [searchParams]);

  const resetForm = () => {
    setFormData({
      slug: '',
      title: { en: '', el: '' },
      content: { en: '', el: '' },
      excerpt: { en: '', el: '' },
      imageUrl: '',
      category: '',
      isPublished: true,
      layout: 'layout1',
    });
    setEditingPage(null);
  };

  const handleEdit = (page: MunicipalityPage) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      title: page.title,
      content: page.content,
      excerpt: page.excerpt || { en: '', el: '' },
      imageUrl: page.imageUrl || '',
      category: page.category,
      isPublished: page.isPublished,
      layout: (page.layout as LayoutType) || 'layout1', // Ensure correct type
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (slug: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      try {
        await deleteMunicipalityPage(slug);
        toast({
          title: "Success",
          description: "Page deleted successfully",
        });
        loadPages();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete page",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPage) {
        const success = await updateMunicipalityPage(editingPage.slug, { ...formData, layout: formData.layout as LayoutType });
        if (success) {
          toast({
            title: "Success",
            description: "Page updated successfully",
          });
        } else {
          throw new Error('Failed to update page');
        }
      } else {
        const result = await createMunicipalityPage({ ...formData, layout: formData.layout as LayoutType });
        if (result) {
          toast({
            title: "Success",
            description: "Page created successfully",
          });
        } else {
          throw new Error('Failed to create page - slug may already exist');
        }
      }
      
      setIsDialogOpen(false);
      resetForm();
      loadPages();
    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save page",
        variant: "destructive",
      });
    }
  };

  const getCategoryLabel = (category: string) => {
    // Only check dynamic categories
    const cat = categories.find(c => c.id === category);
    return cat ? cat.name : { en: category, el: category };
  };

  const filteredPages = selectedCategory === 'all' 
    ? pages 
    : pages.filter(page => page.category === selectedCategory);

  const getCategoryStats = () => {
    // Only include dynamic categories
    return categories.map(cat => ({
      ...cat,
      count: pages.filter(page => page.category === cat.id).length
    }));
  };

  // Category management functions
  const resetCategoryForm = () => {
    setCategoryFormData({
      name: { en: '', el: '' },
      description: { en: '', el: '' },
      icon: 'file-text',
      color: 'blue',
      isActive: true,
      order: categories.length,
    });
    setEditingCategory(null);
  };

  const handleEditCategory = (category: PageCategory) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || { en: '', el: '' },
      icon: category.icon || 'file-text',
      color: category.color || 'blue',
      isActive: category.isActive ?? true,
      order: category.order || 0,
    });
    setShowCategoriesDialog(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await deletePageCategory(id);
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
        loadPages(); // This will reload both pages and categories
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive",
        });
      }
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updatePageCategory(editingCategory.id, categoryFormData);
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        await addPageCategory(categoryFormData);
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }
      
      setShowCategoriesDialog(false);
      resetCategoryForm();
      loadPages(); // This will reload both pages and categories
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      });
    }
  };

  const moveCategory = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = categories.findIndex(cat => cat.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;

    const updatedCategories = [...categories];
    const [movedCategory] = updatedCategories.splice(currentIndex, 1);
    updatedCategories.splice(newIndex, 0, movedCategory);

    // Update order for all categories
    const updatedCategoriesWithOrder = updatedCategories.map((cat, index) => ({
      ...cat,
      order: index
    }));

    try {
      // Update all categories with new order
      for (const category of updatedCategoriesWithOrder) {
        await updatePageCategory(category.id, { order: category.order });
      }
      
      setCategories(updatedCategoriesWithOrder);
      toast({
        title: "Success",
        description: "Category order updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category order",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <HeartbeatLoader size="md" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Management Section */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Municipality Pages</h2>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                resetCategoryForm();
                setShowCategoriesDialog(true);
              }}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Tag className="h-4 w-4 mr-2" />
              <TranslatableText>Manage Categories</TranslatableText>
            </Button>
            <Button 
              onClick={() => {
                if (selectedCategory !== 'all') {
                  setFormData({ ...formData, category: selectedCategory });
                }
                setIsDialogOpen(true);
              }}
              className="bg-primary text-white font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              <TranslatableText>{{ en: 'Create Page', el: 'Δημιουργία Σελίδας' }}</TranslatableText>
            </Button>
          </div>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {getCategoryStats().map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getCategoryColor(category.color || 'gray')}`}>
                    {getCategoryIcon(category.icon || 'file-text')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">
                      <TranslatableText>{category.name}</TranslatableText>
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">{category.count}</p>
                    <p className="text-xs text-gray-500">
                      <TranslatableText>{{ en: 'pages', el: 'σελίδες' }}</TranslatableText>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        {/* Category Filter */}
        <div className="flex items-center gap-4 py-4">
          <Label htmlFor="category-filter" className="text-sm font-medium">
            <TranslatableText>{{ en: 'Filter by category:', el: 'Φιλτράρισμα ανά κατηγορία:' }}</TranslatableText>
          </Label>
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              const params = new URLSearchParams(Array.from(searchParams?.entries() || []));
              if (value === 'all') {
                params.delete('category');
              } else {
                params.set('category', value);
              }
              router.replace(`?${params.toString()}`);
            }}
          >
            <SelectTrigger id="category-filter" className="w-48">
              <SelectValue placeholder={currentLang === 'el' ? 'Όλες οι κατηγορίες' : 'All categories'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <TranslatableText>{{ en: 'All categories', el: 'Όλες οι κατηγορίες' }}</TranslatableText>
              </SelectItem>
              {/* Dynamic categories */}
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <TranslatableText>{category.name}</TranslatableText>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pages List */}
        {filteredPages.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <FileText className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                <TranslatableText>{{ en: "No pages found", el: "Δεν βρέθηκαν σελίδες" }}</TranslatableText>
              </h3>
              <p className="text-gray-500 mb-4">
                {selectedCategory === 'all' 
                  ? (
                    <TranslatableText>{{ en: "Get started by creating your first municipality page.", el: "Ξεκινήστε δημιουργώντας την πρώτη σας σελίδα δήμου." }}</TranslatableText>
                  )
                  : (
                    <TranslatableText>{{ 
                      en: `No pages found in the "${getCategoryLabel(selectedCategory).en}" category.`, 
                      el: `Δεν βρέθηκαν σελίδες στην κατηγορία "${getCategoryLabel(selectedCategory).el}".` 
                    }}</TranslatableText>
                  )
                }
              </p>
              <Button 
                onClick={() => {
                  if (selectedCategory !== 'all') {
                    setFormData({ ...formData, category: selectedCategory });
                  }
                  setIsDialogOpen(true);
                }}
                className="bg-primary text-white font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                <TranslatableText>Create Page</TranslatableText>
                {/* Greek: Δημιουργία Σελίδας */}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredPages.map((page) => (
              <Card key={page.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${getCategoryColor(
                          categories.find(c => c.id === page.category)?.color || 
                          'gray'
                        )}`}>
                          {getCategoryIcon(
                            categories.find(c => c.id === page.category)?.icon || 
                            'file-text'
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          <TranslatableText>{getCategoryLabel(page.category)}</TranslatableText>
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          <TranslatableText>{page.title}</TranslatableText>
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          <TranslatableText>{page.title}</TranslatableText>
                        </p>
                        {page.excerpt && (
                          <p className="text-gray-500 text-sm mb-2">
                            <TranslatableText>{page.excerpt}</TranslatableText>
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Slug: {page.slug}</span>
                          <span>Layout: {page.layout || 'layout1'}</span>
                          <span>Created: {page.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={page.isPublished ? "default" : "secondary"}>
                        <TranslatableText>{page.isPublished ? "Published" : "Draft"}</TranslatableText>
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(page)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        <TranslatableText>Edit</TranslatableText>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(page.slug)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        <TranslatableText>Delete</TranslatableText>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Page Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPage ? 'Edit Page' : 'Create New Page'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="slug" className="text-sm font-medium"><TranslatableText>Slug (URL)</TranslatableText></Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g., about-us, contact-info, services-list"
                  // Greek: π.χ., about-us, contact-info, services-list
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  <TranslatableText>Enter a URL-friendly name (lowercase, hyphens instead of spaces)</TranslatableText>
                  {/* Greek: Εισάγετε ένα φιλικό προς το URL όνομα (πεζά, παύλες αντί για κενά) */}
                </p>
              </div>
              
              <div>
                <Label htmlFor="category" className="text-sm font-medium"><TranslatableText>Category</TranslatableText></Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category" className="mt-1 bg-white border-gray-300">
                    <SelectValue placeholder={<TranslatableText>Select a category</TranslatableText>} />
                    {/* Greek: Επιλέξτε κατηγορία */}
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    {/* Dynamic categories */}
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category.icon || 'file-text')}
                          <span><TranslatableText>{category.name}</TranslatableText></span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title-en" className="text-sm font-medium">Title (English)</Label>
                <Input
                  id="title-en"
                  value={formData.title.en}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                  placeholder="Enter page title in English"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="title-el" className="text-sm font-medium">Title (Greek)</Label>
                <Input
                  id="title-el"
                  value={formData.title.el}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, el: e.target.value } })}
                  placeholder="Εισάγετε τον τίτλο της σελίδας στα ελληνικά"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="excerpt-en" className="text-sm font-medium">Excerpt (English)</Label>
                <Textarea
                  id="excerpt-en"
                  value={formData.excerpt.en}
                  onChange={(e) => setFormData({ ...formData, excerpt: { ...formData.excerpt, en: e.target.value } })}
                  placeholder="Enter a brief description in English"
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="excerpt-el" className="text-sm font-medium">Excerpt (Greek)</Label>
                <Textarea
                  id="excerpt-el"
                  value={formData.excerpt.el}
                  onChange={(e) => setFormData({ ...formData, excerpt: { ...formData.excerpt, el: e.target.value } })}
                  placeholder="Εισάγετε μια σύντομη περιγραφή στα ελληνικά"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            {/* Layout Selection */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Page Layout</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Layout 1 - Standard */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    formData.layout === 'layout1' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData({ ...formData, layout: 'layout1' })}
                >
                  <div className="text-center mb-3">
                    <div className="w-full h-2 bg-gray-300 rounded mb-2"></div>
                    <div className="w-3/4 h-4 bg-gray-300 rounded mb-2 mx-auto"></div>
                    <div className="w-full h-2 bg-gray-300 rounded mb-2"></div>
                    <div className="w-5/6 h-2 bg-gray-300 rounded mb-2 mx-auto"></div>
                    <div className="w-full h-2 bg-gray-300 rounded mb-2"></div>
                    <div className="w-4/5 h-2 bg-gray-300 rounded mb-2 mx-auto"></div>
                    <div className="w-full h-2 bg-gray-300 rounded mb-2"></div>
                    <div className="w-3/4 h-2 bg-gray-300 rounded mx-auto"></div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-sm">Layout 1</h4>
                    <p className="text-xs text-gray-500">Standard Layout</p>
                    <p className="text-xs text-gray-400 mt-1">Hero + Content</p>
                  </div>
                </div>

                {/* Layout 2 - Featured */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    formData.layout === 'layout2' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData({ ...formData, layout: 'layout2' })}
                >
                  <div className="text-center mb-3">
                    <div className="flex gap-2 mb-2">
                      <div className="w-1/3 h-8 bg-gray-300 rounded"></div>
                      <div className="w-2/3 h-8 bg-gray-300 rounded"></div>
                    </div>
                    <div className="w-full h-2 bg-gray-300 rounded mb-2"></div>
                    <div className="w-3/4 h-2 bg-gray-300 rounded mb-2 mx-auto"></div>
                    <div className="w-full h-2 bg-gray-300 rounded mb-2"></div>
                    <div className="w-5/6 h-2 bg-gray-300 rounded mb-2 mx-auto"></div>
                    <div className="w-full h-2 bg-gray-300 rounded mb-2"></div>
                    <div className="w-4/5 h-2 bg-gray-300 rounded mx-auto"></div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-sm">Layout 2</h4>
                    <p className="text-xs text-gray-500">Featured Layout</p>
                    <p className="text-xs text-gray-400 mt-1">Sidebar + Content</p>
                  </div>
                </div>

                {/* Layout 3 - Minimal */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    formData.layout === 'layout3' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData({ ...formData, layout: 'layout3' })}
                >
                  <div className="text-center mb-3">
                    <div className="w-full h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="w-full h-2 bg-gray-300 rounded mb-2"></div>
                    <div className="w-full h-2 bg-gray-300 rounded mb-2"></div>
                    <div className="w-full h-2 bg-gray-300 rounded mb-2"></div>
                    <div className="w-full h-2 bg-gray-300 rounded mb-2"></div>
                    <div className="w-full h-2 bg-gray-300 rounded mb-2"></div>
                    <div className="w-full h-2 bg-gray-300 rounded mb-2"></div>
                    <div className="w-full h-2 bg-gray-300 rounded"></div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-sm">Layout 3</h4>
                    <p className="text-xs text-gray-500">Minimal Layout</p>
                    <p className="text-xs text-gray-400 mt-1">Image Banner + Content</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <Label className="text-sm font-medium">Featured Image</Label>
              <div className="mt-1">
                <ImageUpload
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Content</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500 mb-2 block">English Content</Label>
                  <RichTextEditor
                    value={formData.content.en}
                    onChange={(content) => setFormData({ ...formData, content: { ...formData.content, en: content } })}
                    placeholder="Enter content in English..."
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-2 block">Greek Content</Label>
                  <RichTextEditor
                    value={formData.content.el}
                    onChange={(content) => setFormData({ ...formData, content: { ...formData.content, el: content } })}
                    placeholder="Εισάγετε περιεχόμενο στα ελληνικά..."
                  />
                </div>
              </div>
            </div>

            {/* Publish Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isPublished"
                checked={formData.isPublished}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
              />
              <Label htmlFor="isPublished" className="text-sm font-medium">
                <TranslatableText>Published</TranslatableText>
              </Label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                <TranslatableText>Cancel</TranslatableText>
              </Button>
              <Button type="submit" className="bg-primary text-white">
                {editingPage ? 'Update Page' : 'Create Page'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>



      {/* Categories Management Dialog */}
      <Dialog open={showCategoriesDialog} onOpenChange={setShowCategoriesDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Manage Page Categories'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Category Form */}
            <form onSubmit={handleCategorySubmit} className="space-y-4 border rounded-lg p-4">
              <h3 className="font-semibold text-lg">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cat-name-en" className="text-sm font-medium">Name (English)</Label>
                  <Input
                    id="cat-name-en"
                    value={categoryFormData.name.en}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: { ...categoryFormData.name, en: e.target.value } })}
                    placeholder="Enter category name in English"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cat-name-el" className="text-sm font-medium">Name (Greek)</Label>
                  <Input
                    id="cat-name-el"
                    value={categoryFormData.name.el}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: { ...categoryFormData.name, el: e.target.value } })}
                    placeholder="Εισάγετε το όνομα της κατηγορίας στα ελληνικά"
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cat-description-en" className="text-sm font-medium">Description (English)</Label>
                  <Textarea
                    id="cat-description-en"
                    value={categoryFormData.description.en}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, description: { ...categoryFormData.description, en: e.target.value } })}
                    placeholder="Enter category description in English"
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="cat-description-el" className="text-sm font-medium">Description (Greek)</Label>
                  <Textarea
                    id="cat-description-el"
                    value={categoryFormData.description.el}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, description: { ...categoryFormData.description, el: e.target.value } })}
                    placeholder="Εισάγετε την περιγραφή της κατηγορίας στα ελληνικά"
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cat-icon" className="text-sm font-medium">Icon</Label>
                  <Select
                    value={categoryFormData.icon}
                    onValueChange={(value) => setCategoryFormData({ ...categoryFormData, icon: value })}
                  >
                    <SelectTrigger id="cat-icon" className="mt-1">
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="building">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span><TranslatableText>Building</TranslatableText></span>
                        </div>
                      </SelectItem>
                      <SelectItem value="users">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span><TranslatableText>Users</TranslatableText></span>
                        </div>
                      </SelectItem>
                      <SelectItem value="settings">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          <span><TranslatableText>Settings</TranslatableText></span>
                        </div>
                      </SelectItem>
                      <SelectItem value="heart">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          <span><TranslatableText>Heart</TranslatableText></span>
                        </div>
                      </SelectItem>
                      <SelectItem value="tag">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          <span><TranslatableText>Tag</TranslatableText></span>
                        </div>
                      </SelectItem>
                      <SelectItem value="file-text">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span><TranslatableText>File Text</TranslatableText></span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="cat-color" className="text-sm font-medium">Color</Label>
                  <Select
                    value={categoryFormData.color}
                    onValueChange={(value) => setCategoryFormData({ ...categoryFormData, color: value })}
                  >
                    <SelectTrigger id="cat-color" className="mt-1">
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-blue-100"></div>
                          <span><TranslatableText>Blue</TranslatableText></span>
                        </div>
                      </SelectItem>
                      <SelectItem value="green">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-green-100"></div>
                          <span><TranslatableText>Green</TranslatableText></span>
                        </div>
                      </SelectItem>
                      <SelectItem value="purple">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-purple-100"></div>
                          <span><TranslatableText>Purple</TranslatableText></span>
                        </div>
                      </SelectItem>
                      <SelectItem value="pink">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-pink-100"></div>
                          <span><TranslatableText>Pink</TranslatableText></span>
                        </div>
                      </SelectItem>
                      <SelectItem value="orange">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-orange-100"></div>
                          <span><TranslatableText>Orange</TranslatableText></span>
                        </div>
                      </SelectItem>
                      <SelectItem value="red">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-red-100"></div>
                          <span><TranslatableText>Red</TranslatableText></span>
                        </div>
                      </SelectItem>
                      <SelectItem value="gray">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-gray-100"></div>
                          <span><TranslatableText>Gray</TranslatableText></span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="cat-order" className="text-sm font-medium">Display Order</Label>
                  <Input
                    id="cat-order"
                    type="number"
                    value={categoryFormData.order}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="mt-1"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="cat-isActive"
                  checked={categoryFormData.isActive}
                  onCheckedChange={(checked) => setCategoryFormData({ ...categoryFormData, isActive: checked })}
                />
                <Label htmlFor="cat-isActive" className="text-sm font-medium">
                  <TranslatableText>Active</TranslatableText>
                </Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCategoriesDialog(false);
                    resetCategoryForm();
                  }}
                >
                  <TranslatableText>Cancel</TranslatableText>
                </Button>
                <Button type="submit" className="bg-primary text-white">
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </Button>
              </div>
            </form>

            {/* Categories List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Existing Categories</h3>
              {categories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Tag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p><TranslatableText>No categories found. Create your first category above.</TranslatableText></p>
                </div>
              ) : (
                categories.map((category, index) => {
                  const colorClass = getCategoryColor(category.color || 'blue');
                  
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
                              {getCategoryIcon(category.icon || 'file-text')}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold"><TranslatableText>{category.name}</TranslatableText></h4>
                                <Badge variant={category.isActive ? "default" : "secondary"}>
                                  <TranslatableText>{category.isActive ? 'Active' : 'Inactive'}</TranslatableText>
                                </Badge>
                                <Badge variant="outline">
                                  <TranslatableText>Order:</TranslatableText> {category.order}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
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
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
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
        </DialogContent>
      </Dialog>
    </div>
  );
} 