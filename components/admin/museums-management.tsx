'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, MapPin, Filter, Accessibility } from 'lucide-react';
import { MuseumForm } from './museum-form';
import { ContentFilters, FilterOptions } from './content-filters';
import { fetchMuseums, deleteMuseum, addMuseum } from '@/lib/firestore';
import { applyMuseumsFilters, extractCategories, extractLocations } from '@/lib/filter-utils';
import { toast } from 'sonner';
import { TranslatableText } from '@/components/translatable-content';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

// Helper function to get localized text
const getLocalizedText = (text: string | { en: string; el: string }, currentLang: string): string => {
  if (typeof text === 'string') {
    return text;
  }
  return text[currentLang as keyof typeof text] || text.en || '';
};

const defaultFilters: FilterOptions = {
  search: '',
  status: 'all',
  featured: 'all',
  dateRange: 'all',
  category: undefined,
  location: undefined,
  accessibility: 'all'
};

export function MuseumsManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingMuseum, setEditingMuseum] = useState<any>(null);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [museums, setMuseums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { currentLang } = useTranslation();

  const loadMuseums = async () => {
    setLoading(true);
    const data = await fetchMuseums();
    setMuseums(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMuseums();
  }, []);

  // Apply filters to museums
  const filteredMuseums = applyMuseumsFilters(museums, filters);
  
  // Extract categories and locations for filter options
  const categories = extractCategories(museums);
  const locations = extractLocations(museums);

  const handleEdit = (museum: any) => {
    setEditingMuseum(museum);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm(currentLang === 'el' ? 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το μουσείο;' : 'Are you sure you want to delete this museum?')) {
      await deleteMuseum(id);
      toast.success(currentLang === 'el' ? 'Το μουσείο διαγράφηκε επιτυχώς' : 'Museum deleted successfully');
      loadMuseums();
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMuseum(null);
    loadMuseums();
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
  };

  if (showForm) {
    return (
      <MuseumForm 
        museum={editingMuseum} 
        onClose={handleFormClose} 
      />
    );
  }

  return (
    <div className="space-y-6">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setShowForm(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            <TranslatableText>{{ en: "Add Museum", el: "Προσθήκη Μουσείου" }}</TranslatableText>
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            <TranslatableText>{{ en: 'Filters', el: 'Φίλτρα' }}</TranslatableText>
            {filters.search || filters.status !== 'all' || filters.featured !== 'all' || filters.dateRange !== 'all' || filters.category || filters.location || filters.accessibility !== 'all' ? (
              <Badge variant="secondary" className="ml-1">
                {[filters.search, filters.status, filters.featured, filters.dateRange, filters.category, filters.location, filters.accessibility].filter(Boolean).length}
              </Badge>
            ) : null}
          </Button>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-gray-800">
            <TranslatableText>{{ en: 'Museums and Places Management', el: 'Διαχείριση Μουσείων και Χώρων' }}</TranslatableText>
          </h2>
          <p className="text-sm text-gray-600">
            <TranslatableText>{{ en: `${filteredMuseums.length} of ${museums.length} museums`, el: `${filteredMuseums.length} από ${museums.length} μουσεία` }}</TranslatableText>
          </p>
        </div>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: showFilters ? 1 : 0, height: showFilters ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {showFilters && (
          <ContentFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            categories={categories}
            locations={locations}
            contentType="museums"
          />
        )}
      </motion.div>

      {/* Results Summary */}
      {filters.search || filters.status !== 'all' || filters.featured !== 'all' || filters.dateRange !== 'all' || filters.category || filters.location || filters.accessibility !== 'all' ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-purple-800">
              <TranslatableText>{{ en: `Showing ${filteredMuseums.length} filtered results`, el: `Εμφάνιση ${filteredMuseums.length} φιλτραρισμένων αποτελεσμάτων` }}</TranslatableText>
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="text-purple-600 hover:text-purple-700"
          >
            <TranslatableText>{{ en: 'Clear Filters', el: 'Καθαρισμός Φίλτρων' }}</TranslatableText>
          </Button>
        </motion.div>
      ) : null}

      {/* Content Grid */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center h-40"
        >
          <p className="text-gray-500">
            <TranslatableText>{{ en: 'Loading...', el: 'Φόρτωση...' }}</TranslatableText>
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredMuseums.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow h-full">
                {item.imageUrl && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={item.imageUrl}
                      alt={getLocalizedText(item.title, currentLang)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">
                        {getLocalizedText(item.title, currentLang)}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-2">
                        {getLocalizedText(item.description, currentLang)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant={item.published ? 'default' : 'secondary'}>
                      {item.published ? (
                        <TranslatableText>{{ en: 'Published', el: 'Δημοσιευμένο' }}</TranslatableText>
                      ) : (
                        <TranslatableText>{{ en: 'Draft', el: 'Πρόχειρο' }}</TranslatableText>
                      )}
                    </Badge>
                    {item.featured && (
                      <Badge variant="outline">
                        <TranslatableText>{{ en: 'Featured', el: 'Προτεινόμενο' }}</TranslatableText>
                      </Badge>
                    )}
                    {item.category && (
                      <Badge variant="outline" className="text-purple-600">
                        {item.category}
                      </Badge>
                    )}
                    {item.accessibility && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Accessibility className="h-3 w-3" />
                        <span>{item.accessibility}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{getLocalizedText(item.location, currentLang)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && filteredMuseums.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              <TranslatableText>{{ en: "No museums found", el: "Δεν βρέθηκαν μουσεία" }}</TranslatableText>
            </h3>
            <p className="text-gray-500 mb-4">
              {filters.search || filters.status !== 'all' || filters.featured !== 'all' || filters.dateRange !== 'all' || filters.category || filters.location || filters.accessibility !== 'all' ? (
                <TranslatableText>{{ en: "Try adjusting your filters or search terms", el: "Δοκιμάστε να προσαρμόσετε τα φίλτρα ή τους όρους αναζήτησης" }}</TranslatableText>
              ) : (
                <TranslatableText>{{ en: "Get started by adding your first museum", el: "Ξεκινήστε προσθέτοντας το πρώτο σας μουσείο" }}</TranslatableText>
              )}
            </p>
            {filters.search || filters.status !== 'all' || filters.featured !== 'all' || filters.dateRange !== 'all' || filters.category || filters.location || filters.accessibility !== 'all' ? (
              <Button onClick={clearAllFilters} variant="outline">
                <TranslatableText>{{ en: 'Clear All Filters', el: 'Καθαρισμός Όλων των Φίλτρων' }}</TranslatableText>
              </Button>
            ) : (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                <TranslatableText>{{ en: 'Add Museum', el: 'Προσθήκη Μουσείου' }}</TranslatableText>
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
} 