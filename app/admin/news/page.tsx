'use client';

import { useState, useEffect } from 'react';
import { NewsManagement } from '@/components/admin/news-management';
import { TranslatableText } from '@/components/translatable-content';

export default function AdminNewsPage() {
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
          <TranslatableText>{{ en: 'News Management', el: 'Διαχείριση Ειδήσεων' }}</TranslatableText>
        </h1>
      </div>
      <NewsManagement />
    </div>
  );
}