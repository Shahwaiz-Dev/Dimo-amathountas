import { AdminLayout } from '@/components/admin/admin-layout';

export const metadata = {
  title: 'Admin Panel | Agios Athanasios Municipality',
  description: 'Administrative panel for managing Agios Athanasios Municipality website content, news, and events.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout>{children}</AdminLayout>
  );
} 