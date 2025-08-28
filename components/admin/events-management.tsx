'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Calendar, MapPin, Filter } from 'lucide-react';
import { EventForm } from './event-form';
import { ContentFilters, FilterOptions } from './content-filters';
import { fetchEvents, deleteEvent, addEvent } from '@/lib/firestore';
import { applyEventsFilters, extractCategories, extractLocations } from '@/lib/filter-utils';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { TranslatableText } from '@/components/translatable-content';
import { motion } from 'framer-motion';

// Helper function to get localized text
const getLocalizedText = (text: string | { en: string; el: string }): string => {
  if (typeof text === 'string') {
    return text;
  }
  return text.en || '';
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

export function EventsManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const loadEvents = async () => {
    setLoading(true);
    const data = await fetchEvents();
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Apply filters to events
  const filteredEvents = applyEventsFilters(events, filters);
  
  // Extract categories and locations for filter options
  const categories = extractCategories(events);
  const locations = extractLocations(events);

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(id);
      toast.success('Event deleted successfully');
      loadEvents();
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEvent(null);
    loadEvents();
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
  };

  if (showForm) {
    return <EventForm event={editingEvent} onClose={handleFormClose} />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
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
            <TranslatableText>Add Event</TranslatableText>
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            <TranslatableText>Filters</TranslatableText>
            {filters.search || filters.status !== 'all' || filters.featured !== 'all' || filters.dateRange !== 'all' || filters.category || filters.location ? (
              <Badge variant="secondary" className="ml-1">
                {[filters.search, filters.status, filters.featured, filters.dateRange, filters.category, filters.location].filter(Boolean).length}
              </Badge>
            ) : null}
          </Button>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-gray-800">
            <TranslatableText>Events Management</TranslatableText>
          </h2>
          <p className="text-sm text-gray-600">
            <TranslatableText>{{ en: `${filteredEvents.length} of ${events.length} events`, el: `${filteredEvents.length} από ${events.length} εκδηλώσεις` }}</TranslatableText>
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
            contentType="events"
          />
        )}
      </motion.div>

      {/* Results Summary */}
      {filters.search || filters.status !== 'all' || filters.featured !== 'all' || filters.dateRange !== 'all' || filters.category || filters.location ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-800">
              <TranslatableText>{{ en: `Showing ${filteredEvents.length} filtered results`, el: `Εμφάνιση ${filteredEvents.length} φιλτραρισμένων αποτελεσμάτων` }}</TranslatableText>
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="text-green-600 hover:text-green-700"
          >
            <TranslatableText>Clear Filters</TranslatableText>
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
            <TranslatableText>Loading...</TranslatableText>
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredEvents.map((item, index) => (
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
                      alt={getLocalizedText(item.title)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">
                        {getLocalizedText(item.title)}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-2">
                        {getLocalizedText(item.description)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant={item.published ? 'default' : 'secondary'}>
                      {item.published ? (
                        <TranslatableText>Published</TranslatableText>
                      ) : (
                        <TranslatableText>Draft</TranslatableText>
                      )}
                    </Badge>
                    {item.featured && (
                      <Badge variant="outline">
                        <TranslatableText>Featured</TranslatableText>
                      </Badge>
                    )}
                    {item.category && (
                      <Badge variant="outline" className="text-indigo-600">
                        {item.category}
                      </Badge>
                    )}
                    {/* Scheduled badge if in the future */}
                    {(() => {
                      const now = Date.now();
                      const publishDate = item.publishDate?.seconds ? item.publishDate.seconds * 1000 : (item.publishDate ? new Date(item.publishDate).getTime() : null);
                      if (publishDate && publishDate > now) {
                        return (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            <TranslatableText>Scheduled for</TranslatableText>: {new Date(publishDate).toLocaleString()}
                          </Badge>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(item.date?.seconds ? new Date(item.date.seconds * 1000).toISOString() : item.date)}</span>
                    </div>
                    {item.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{getLocalizedText(item.location)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {formatDate(item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toISOString() : item.createdAt)}
                    </span>
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
      {!loading && filteredEvents.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              <TranslatableText>{{ en: "No events found", el: "Δεν βρέθηκαν εκδηλώσεις" }}</TranslatableText>
            </h3>
            <p className="text-gray-500 mb-4">
              {filters.search || filters.status !== 'all' || filters.featured !== 'all' || filters.dateRange !== 'all' || filters.category || filters.location ? (
                <TranslatableText>{{ en: "Try adjusting your filters or search terms", el: "Δοκιμάστε να προσαρμόσετε τα φίλτρα ή τους όρους αναζήτησης" }}</TranslatableText>
              ) : (
                <TranslatableText>{{ en: "Get started by adding your first event", el: "Ξεκινήστε προσθέτοντας την πρώτη σας εκδήλωση" }}</TranslatableText>
              )}
            </p>
            {filters.search || filters.status !== 'all' || filters.featured !== 'all' || filters.dateRange !== 'all' || filters.category || filters.location ? (
              <Button onClick={clearAllFilters} variant="outline">
                <TranslatableText>Clear All Filters</TranslatableText>
              </Button>
            ) : (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                <TranslatableText>Add Event</TranslatableText>
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}