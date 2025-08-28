'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPageCategories, getNavbarCategories, PageCategory } from '@/lib/firestore';
import { TranslatableText } from '@/components/translatable-content';

export function CategoryDebugComponent() {
  const [allCategories, setAllCategories] = useState<PageCategory[]>([]);
  const [navbarCategories, setNavbarCategories] = useState<PageCategory[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [all, navbar] = await Promise.all([
        getPageCategories(),
        getNavbarCategories()
      ]);
      setAllCategories(all);
      setNavbarCategories(navbar);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <TranslatableText>{{ en: 'Category Debug Information', el: 'Πληροφορίες Debug Κατηγοριών' }}</TranslatableText>
            <Button onClick={loadData} disabled={loading} variant="outline" size="sm">
              <TranslatableText>{{ en: 'Refresh', el: 'Ανανέωση' }}</TranslatableText>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* All Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                <TranslatableText>{{ en: 'All Categories', el: 'Όλες οι Κατηγορίες' }}</TranslatableText> ({allCategories.length})
              </h3>
              <div className="space-y-2">
                {allCategories.map((cat) => (
                  <div key={cat.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">
                        <TranslatableText>{cat.name}</TranslatableText>
                      </h4>
                      <div className="flex gap-1">
                        <Badge variant={cat.isActive ? "default" : "secondary"} className="text-xs">
                          {cat.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge 
                          variant={cat.showInNavbar ? "default" : "outline"} 
                          className={`text-xs ${cat.showInNavbar ? 'bg-green-100 text-green-700' : ''}`}
                        >
                          {cat.showInNavbar ? 'Navbar' : 'No Navbar'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>ID: {cat.id}</div>
                      <div>showInNavbar: {String(cat.showInNavbar)}</div>
                      <div>isActive: {String(cat.isActive)}</div>
                      <div>hasShowInNavbar: {String(cat.hasOwnProperty('showInNavbar'))}</div>
                      {cat.parentCategory && <div>Parent: {cat.parentCategory}</div>}
                    </div>
                  </div>
                ))}
                {allCategories.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    <TranslatableText>{{ en: 'No categories found', el: 'Δεν βρέθηκαν κατηγορίες' }}</TranslatableText>
                  </div>
                )}
              </div>
            </div>

            {/* Navbar Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                <TranslatableText>{{ en: 'Navbar Categories', el: 'Κατηγορίες Navbar' }}</TranslatableText> ({navbarCategories.length}/10)
              </h3>
              <div className="space-y-2">
                {navbarCategories.map((cat) => (
                  <div key={cat.id} className="p-3 border rounded-lg bg-green-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">
                        <TranslatableText>{cat.name}</TranslatableText>
                      </h4>
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        In Navbar
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      ID: {cat.id}
                    </div>
                  </div>
                ))}
                {navbarCategories.length === 0 && (
                  <div className="text-center text-red-500 py-4">
                    <TranslatableText>{{ en: '⚠️ No navbar categories found!', el: '⚠️ Δεν βρέθηκαν κατηγορίες navbar!' }}</TranslatableText>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">
              <TranslatableText>{{ en: 'Summary', el: 'Περίληψη' }}</TranslatableText>
            </h4>
            <div className="text-sm space-y-1">
              <div>
                <TranslatableText>{{ en: 'Total Categories', el: 'Συνολικές Κατηγορίες' }}</TranslatableText>: {allCategories.length}
              </div>
              <div>
                <TranslatableText>{{ en: 'Active Categories', el: 'Ενεργές Κατηγορίες' }}</TranslatableText>: {allCategories.filter(c => c.isActive).length}
              </div>
              <div>
                <TranslatableText>{{ en: 'Categories with showInNavbar=true', el: 'Κατηγορίες με showInNavbar=true' }}</TranslatableText>: {allCategories.filter(c => c.showInNavbar === true).length}
              </div>
              <div>
                <TranslatableText>{{ en: 'Categories appearing in navbar', el: 'Κατηγορίες που εμφανίζονται στο navbar' }}</TranslatableText>: {navbarCategories.length}
              </div>
              <div>
                <TranslatableText>{{ en: 'Categories missing showInNavbar property', el: 'Κατηγορίες που λείπει η ιδιότητα showInNavbar' }}</TranslatableText>: {allCategories.filter(c => !c.hasOwnProperty('showInNavbar')).length}
              </div>
            </div>
            
            {allCategories.filter(c => !c.hasOwnProperty('showInNavbar')).length > 0 && (
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                <div className="text-yellow-800 text-sm">
                  <strong>⚠️ Action Required:</strong>
                  <br />
                  <TranslatableText>{{ en: 'Some categories are missing the showInNavbar property. Run the migration script:', el: 'Κάποιες κατηγορίες λείπει η ιδιότητα showInNavbar. Εκτελέστε το migration script:' }}</TranslatableText>
                  <br />
                  <code className="bg-yellow-200 px-2 py-1 rounded mt-1 inline-block">
                    node scripts/migrate-categories-navbar.js
                  </code>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
