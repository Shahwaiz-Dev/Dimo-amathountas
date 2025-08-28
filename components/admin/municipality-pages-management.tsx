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
  User,
  FileText,
  AlertCircle,
  HandHeart,
  Briefcase,
  Tag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getAllMunicipalityPages, 
  createMunicipalityPage, 
  updateMunicipalityPage, 
  deleteMunicipalityPage,
  MunicipalityPage,
  getPageCategories,
  PageCategory
} from '@/lib/firestore';
import { ImageUpload } from '@/components/ui/image-upload';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { TranslatableText } from '@/components/translatable-content';
import { HeartbeatLoader } from '@/components/ui/heartbeat-loader';
import { MunicipalityPageContent } from '@/components/municipality/municipality-page-content';
import { useTranslation } from '@/hooks/useTranslation';



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
        
        {/* Link to Main Categories Page */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                <TranslatableText>{{ en: 'Manage Categories', el: 'Διαχείριση Κατηγοριών' }}</TranslatableText>
              </h3>
              <p className="text-sm text-blue-800">
                <TranslatableText>{{ en: 'For better category management, use the dedicated Categories page', el: 'Για καλύτερη διαχείριση κατηγοριών, χρησιμοποιήστε την αφιερωμένη σελίδα Κατηγοριών' }}</TranslatableText>
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = '/admin/categories'}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <TranslatableText>{{ en: 'Go to Categories', el: 'Μετάβαση σε Κατηγορίες' }}</TranslatableText>
            </Button>
          </div>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {getCategoryStats().map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                    <Tag className="h-5 w-5" />
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
              {/* Dynamic categories with subcategories */}
              {(() => {
                // Organize categories hierarchically
                const mainCategories = categories.filter(cat => !cat.parentCategory);
                const subcategories = categories.filter(cat => cat.parentCategory);
                
                return (
                  <>
                    {/* Main categories */}
                    {mainCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <span className="font-medium"><TranslatableText>{category.name}</TranslatableText></span>
                      </SelectItem>
                    ))}
                    
                    {/* Subcategories (indented) */}
                    {subcategories.map((subcat) => {
                      const parent = categories.find(cat => cat.id === subcat.parentCategory);
                      return (
                        <SelectItem key={subcat.id} value={subcat.id}>
                          <div className="flex items-center">
                            <span className="ml-4 text-gray-600">└─ <TranslatableText>{subcat.name}</TranslatableText></span>
                            {parent && (
                              <span className="text-xs text-gray-400 ml-2">
                                (<TranslatableText>{{ en: 'under', el: 'υπό' }}</TranslatableText> <TranslatableText>{parent.name}</TranslatableText>)
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </>
                );
              })()}
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
                        <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                          <Tag className="h-5 w-5" />
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
                    {/* Dynamic categories with subcategories */}
                    {(() => {
                      // Organize categories hierarchically
                      const mainCategories = categories.filter(cat => !cat.parentCategory);
                      const subcategories = categories.filter(cat => cat.parentCategory);
                      
                      return (
                        <>
                          {/* Main categories */}
                          {mainCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                <span className="font-medium"><TranslatableText>{category.name}</TranslatableText></span>
                              </div>
                            </SelectItem>
                          ))}
                          
                          {/* Subcategories (indented) */}
                          {subcategories.map((subcat) => {
                            const parent = categories.find(cat => cat.id === subcat.parentCategory);
                            return (
                              <SelectItem key={subcat.id} value={subcat.id}>
                                <div className="flex items-center gap-2">
                                  <span className="ml-4 text-gray-600">└─ <TranslatableText>{subcat.name}</TranslatableText></span>
                                  {parent && (
                                    <span className="text-xs text-gray-400 ml-2">
                                      (<TranslatableText>{{ en: 'under', el: 'υπό' }}</TranslatableText> <TranslatableText>{parent.name}</TranslatableText>)
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </>
                      );
                    })()}
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




