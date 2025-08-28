'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { useState } from 'react';

export function TestTranslation() {
  const { currentLang, setCurrentLang, translate, isTranslating } = useTranslation();
  const [testText, setTestText] = useState('Hello, this is a test message.');
  const [translatedText, setTranslatedText] = useState('');

  const handleTranslate = async () => {
    const result = await translate(testText, currentLang === 'en' ? 'el' : 'en');
    setTranslatedText(result);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Translation Test</h3>
      
      <div className="mb-4">
        <p><strong>Current Language:</strong> {currentLang}</p>
        <p><strong>Is Translating:</strong> {isTranslating ? 'Yes' : 'No'}</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Test Text:</label>
        <input
          type="text"
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <button
          onClick={handleTranslate}
          disabled={isTranslating}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isTranslating ? 'Translating...' : 'Translate'}
        </button>
      </div>

      {translatedText && (
        <div className="mb-4">
          <p><strong>Translated Text:</strong></p>
          <p className="p-2 bg-white border rounded">{translatedText}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setCurrentLang('en')}
          className={`px-3 py-1 rounded ${currentLang === 'en' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
        >
          English
        </button>
        <button
          onClick={() => setCurrentLang('el')}
          className={`px-3 py-1 rounded ${currentLang === 'el' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
        >
          Greek
        </button>
      </div>
    </div>
  );
} 