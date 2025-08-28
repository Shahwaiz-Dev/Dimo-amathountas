'use client';

import { useState, useEffect } from 'react';
import { HeartbeatLoader } from './heartbeat-loader';

export function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time and hide loader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loader for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="mb-6">
          <HeartbeatLoader size="lg" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Agios Athanasios Municipality
        </h1>
        <p className="text-gray-600">
          Loading...
        </p>
      </div>
    </div>
  );
} 