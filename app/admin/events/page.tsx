'use client';

import { useState, useEffect } from 'react';
import { EventsManagement } from '@/components/admin/events-management';
import { TranslatableText } from '@/components/translatable-content';

export default function AdminEventsPage() {
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
          <TranslatableText>{{ en: 'Events Management', el: 'Διαχείριση Εκδηλώσεων' }}</TranslatableText>
        </h1>
      </div>
      <EventsManagement />
    </div>
  );
}