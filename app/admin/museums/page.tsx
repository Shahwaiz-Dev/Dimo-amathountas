'use client';

import { useState, useEffect } from 'react';
import { MuseumsManagement } from '@/components/admin/museums-management';
import { TranslatableText } from '@/components/translatable-content';

export default function AdminMuseumsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          <TranslatableText>{{ en: 'Museums and Places Management', el: 'Διαχείριση Μουσείων και Χώρων' }}</TranslatableText>
        </h1>
      </div>
      <MuseumsManagement />
    </div>
  );
} 