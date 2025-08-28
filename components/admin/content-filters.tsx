'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  MapPin, 
  Eye, 
  EyeOff, 
  Star,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { TranslatableText } from '@/components/translatable-content';
import { motion, AnimatePresence } from 'framer-motion';

export interface FilterOptions {
  search: string;
  status: 'all' | 'published' | 'draft' | 'scheduled';
  featured: 'all' | 'featured' | 'not-featured';
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  category?: string;
  location?: string;
  accessibility?: 'all' | 'accessible' | 'not-accessible';
}

interface ContentFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  categories?: string[];
  locations?: string[];
  contentType: 'news' | 'events' | 'museums';
  showAdvancedFilters?: boolean;
  onToggleAdvancedFilters?: () => void;
}

export function ContentFilters({
  filters,
  onFiltersChange,
  categories = [],
  locations = [],
  contentType,
  showAdvancedFilters = false,
  onToggleAdvancedFilters
}: ContentFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(showAdvancedFilters);

  const updateFilter = (key: keyof FilterOptions, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      featured: 'all',
      dateRange: 'all',
      category: undefined,
      location: undefined,
      accessibility: 'all'
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.status !== 'all' ||
      filters.featured !== 'all' ||
      filters.dateRange !== 'all' ||
      filters.category ||
      filters.location ||
      filters.accessibility !== 'all'
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'all') count++;
    if (filters.featured !== 'all') count++;
    if (filters.dateRange !== 'all') count++;
    if (filters.category) count++;
    if (filters.location) count++;
    if (filters.accessibility !== 'all') count++;
    return count;
  };

  return (
    <Card className="shadow-sm border-0 bg-gradient-to-r from-gray-50 to-slate-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5 text-blue-600" />
            <TranslatableText>{{ en: "Filters", el: "Φίλτρα" }}</TranslatableText>
            {hasActiveFilters() && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters() && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4 mr-1" />
                <TranslatableText>{{ en: "Clear All", el: "Καθαρισμός Όλων" }}</TranslatableText>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <EyeOff className="w-4 h-4 mr-1" />
                  <TranslatableText>{{ en: "Hide", el: "Απόκρυψη" }}</TranslatableText>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1" />
                  <TranslatableText>{{ en: "Show", el: "Εμφάνιση" }}</TranslatableText>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <CardContent className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={
                    contentType === 'news' 
                      ? 'Search news articles...' 
                      : contentType === 'events'
                      ? 'Search events...'
                      : 'Search museums...'
                  }
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Basic Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    <TranslatableText>{{ en: "Status", el: "Κατάσταση" }}</TranslatableText>
                  </label>
                  <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <TranslatableText>{{ en: "All Status", el: "Όλες οι Καταστάσεις" }}</TranslatableText>
                      </SelectItem>
                      <SelectItem value="published">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <TranslatableText>{{ en: "Published", el: "Δημοσιευμένο" }}</TranslatableText>
                        </div>
                      </SelectItem>
                      <SelectItem value="draft">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                          <TranslatableText>{{ en: "Draft", el: "Πρόχειρο" }}</TranslatableText>
                        </div>
                      </SelectItem>
                      <SelectItem value="scheduled">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <TranslatableText>{{ en: "Scheduled", el: "Προγραμματισμένο" }}</TranslatableText>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Featured Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    <TranslatableText>{{ en: "Featured", el: "Προβεβλημένο" }}</TranslatableText>
                  </label>
                  <Select value={filters.featured} onValueChange={(value) => updateFilter('featured', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <TranslatableText>{{ en: "All Items", el: "Όλα τα Αντικείμενα" }}</TranslatableText>
                      </SelectItem>
                      <SelectItem value="featured">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <TranslatableText>{{ en: "Featured Only", el: "Μόνο Προβεβλημένα" }}</TranslatableText>
                        </div>
                      </SelectItem>
                      <SelectItem value="not-featured">
                        <TranslatableText>{{ en: "Not Featured", el: "Μη Προβεβλημένα" }}</TranslatableText>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    <TranslatableText>{{ en: "Date Range", el: "Εύρος Ημερομηνίας" }}</TranslatableText>
                  </label>
                  <Select value={filters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <TranslatableText>{{ en: "All Time", el: "Όλος ο Χρόνος" }}</TranslatableText>
                      </SelectItem>
                      <SelectItem value="today">
                        <TranslatableText>{{ en: "Today", el: "Σήμερα" }}</TranslatableText>
                      </SelectItem>
                      <SelectItem value="week">
                        <TranslatableText>{{ en: "This Week", el: "Αυτή την Εβδομάδα" }}</TranslatableText>
                      </SelectItem>
                      <SelectItem value="month">
                        <TranslatableText>{{ en: "This Month", el: "Αυτόν τον Μήνα" }}</TranslatableText>
                      </SelectItem>
                      <SelectItem value="year">
                        <TranslatableText>{{ en: "This Year", el: "Αυτό το Έτος" }}</TranslatableText>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter (if categories exist) */}
                {categories.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      <TranslatableText>{{ en: "Category", el: "Κατηγορία" }}</TranslatableText>
                    </label>
                    <Select value={filters.category || 'all'} onValueChange={(value) => updateFilter('category', value === 'all' ? undefined : value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <TranslatableText>{{ en: "All Categories", el: "Όλες οι Κατηγορίες" }}</TranslatableText>
                        </SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Advanced Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location Filter (for events and museums) */}
                {(contentType === 'events' || contentType === 'museums') && locations.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <TranslatableText>{{ en: "Location", el: "Τοποθεσία" }}</TranslatableText>
                    </label>
                    <Select value={filters.location || 'all'} onValueChange={(value) => updateFilter('location', value === 'all' ? undefined : value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <TranslatableText>{{ en: "All Locations", el: "Όλες οι Τοποθεσίες" }}</TranslatableText>
                        </SelectItem>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Accessibility Filter (for museums) */}
                {contentType === 'museums' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      <TranslatableText>{{ en: "Accessibility", el: "Προσβασιμότητα" }}</TranslatableText>
                    </label>
                    <Select value={filters.accessibility || 'all'} onValueChange={(value) => updateFilter('accessibility', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <TranslatableText>{{ en: "All Places", el: "Όλοι οι Χώροι" }}</TranslatableText>
                        </SelectItem>
                        <SelectItem value="accessible">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <TranslatableText>{{ en: "Accessible", el: "Προσβάσιμο" }}</TranslatableText>
                          </div>
                        </SelectItem>
                        <SelectItem value="not-accessible">
                          <TranslatableText>{{ en: "Not Accessible", el: "Μη Προσβάσιμο" }}</TranslatableText>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters() && (
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  <span className="text-sm text-gray-600">
                    <TranslatableText>{{ en: "Active filters:", el: "Ενεργά φίλτρα:" }}</TranslatableText>
                  </span>
                  {filters.search && (
                    <Badge variant="outline" className="text-blue-600">
                      <Search className="w-3 h-3 mr-1" />
                      "{filters.search}"
                    </Badge>
                  )}
                  {filters.status !== 'all' && (
                    <Badge variant="outline" className="text-green-600">
                      {filters.status === 'published' ? 'Published' : filters.status === 'draft' ? 'Draft' : 'Scheduled'}
                    </Badge>
                  )}
                  {filters.featured !== 'all' && (
                    <Badge variant="outline" className="text-yellow-600">
                      {filters.featured === 'featured' ? 'Featured' : 'Not Featured'}
                    </Badge>
                  )}
                  {filters.dateRange !== 'all' && (
                    <Badge variant="outline" className="text-purple-600">
                      {filters.dateRange === 'today' ? 'Today' : 
                       filters.dateRange === 'week' ? 'This Week' :
                       filters.dateRange === 'month' ? 'This Month' : 'This Year'}
                    </Badge>
                  )}
                  {filters.category && (
                    <Badge variant="outline" className="text-indigo-600">
                      {filters.category}
                    </Badge>
                  )}
                  {filters.location && (
                    <Badge variant="outline" className="text-orange-600">
                      <MapPin className="w-3 h-3 mr-1" />
                      {filters.location}
                    </Badge>
                  )}
                  {filters.accessibility && filters.accessibility !== 'all' && (
                    <Badge variant="outline" className="text-emerald-600">
                      {filters.accessibility === 'accessible' ? 'Accessible' : 'Not Accessible'}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
} 