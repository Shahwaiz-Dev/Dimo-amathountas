import { AdminLayout } from '@/components/admin/admin-layout';

export const metadata = {
  title: 'Admin Panel | Dimos Amathountas',
  description: 'Administrative panel for managing Dimos Amathountas website content, news, and events.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout>{children}</AdminLayout>
  );
} 