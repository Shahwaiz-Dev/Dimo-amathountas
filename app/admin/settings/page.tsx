'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TranslatableText } from '@/components/translatable-content';
import { useTranslation } from '@/hooks/useTranslation';

export default function AdminSettingsPage() {
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [error, setError] = useState('');
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { currentLang } = useTranslation();

  const handleChangePassword = () => {
    setError('');
    setLoading(true);
    setTimeout(() => {
    const storedPassword = localStorage.getItem('adminPassword') || 'admin123';
    if (password.current !== storedPassword) {
      setError(currentLang === 'el' ? 'Ο τρέχων κωδικός πρόσβασης είναι λάθος.' : 'Current password is incorrect.');
      setLoading(false);
      return;
    }
    if (!password.new || password.new.length < 4) {
      setError(currentLang === 'el' ? 'Ο νέος κωδικός πρόσβασης πρέπει να έχει τουλάχιστον 4 χαρακτήρες.' : 'New password must be at least 4 characters.');
      setLoading(false);
      return;
    }
    if (password.new !== password.confirm) {
      setError(currentLang === 'el' ? 'Οι νέοι κωδικοί πρόσβασης δεν ταιριάζουν.' : 'New passwords do not match.');
      setLoading(false);
      return;
    }
    localStorage.setItem('adminPassword', password.new);
    toast({
      title: currentLang === 'el' ? 'Ο κωδικός πρόσβασης άλλαξε επιτυχώς!' : 'Password changed successfully!',
      description: '',
      duration: 3000,
    });
    setPassword({ current: '', new: '', confirm: '' });
    setLoading(false);
    }, 900);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-10">
      <h1 className="text-3xl font-bold mb-6">
        <TranslatableText>{{ en: 'Settings', el: 'Ρυθμίσεις' }}</TranslatableText>
      </h1>

      {/* Password Section */}
      <section className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-2">
          <TranslatableText>{{ en: 'Change Password', el: 'Αλλαγή Κωδικού Πρόσβασης' }}</TranslatableText>
        </h2>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              type={showPassword.current ? 'text' : 'password'}
              placeholder={currentLang === 'el' ? 'Τρέχων Κωδικός Πρόσβασης' : 'Current Password'}
              value={password.current}
              onChange={e => setPassword(p => ({ ...p, current: e.target.value }))}
              className="px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary w-full pr-10"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(p => ({ ...p, current: !p.current }))}
              tabIndex={-1}
            >
              {showPassword.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword.new ? 'text' : 'password'}
              placeholder={currentLang === 'el' ? 'Νέος Κωδικός Πρόσβασης' : 'New Password'}
              value={password.new}
              onChange={e => setPassword(p => ({ ...p, new: e.target.value }))}
              className="px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary w-full pr-10"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(p => ({ ...p, new: !p.new }))}
              tabIndex={-1}
            >
              {showPassword.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword.confirm ? 'text' : 'password'}
              placeholder={currentLang === 'el' ? 'Επιβεβαίωση Νέου Κωδικού' : 'Confirm New Password'}
              value={password.confirm}
              onChange={e => setPassword(p => ({ ...p, confirm: e.target.value }))}
              className="px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary w-full pr-10"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(p => ({ ...p, confirm: !p.confirm }))}
              tabIndex={-1}
            >
              {showPassword.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button
            className="w-fit bg-primary text-white font-semibold"
            type="button"
            onClick={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                <TranslatableText>{{ en: 'Changing...', el: 'Αλλαγή...' }}</TranslatableText>
              </span>
            ) : (
              <TranslatableText>{{ en: 'Change Password', el: 'Αλλαγή Κωδικού' }}</TranslatableText>
            )}
          </Button>
        </div>
      </section>
    </div>
  );
} 