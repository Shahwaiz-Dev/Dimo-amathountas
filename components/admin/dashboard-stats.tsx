import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, Building, Landmark, Tag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { TranslatableText } from '@/components/translatable-content';

interface DashboardStatsProps {
  newsCount: number;
  eventsCount: number;
  museumsCount: number;
  pagesCount: number;
  categoriesCount: number;
  loading: boolean;
}

export function DashboardStats({ 
  newsCount, 
  eventsCount, 
  museumsCount, 
  pagesCount, 
  categoriesCount, 
  loading 
}: DashboardStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">
            <TranslatableText>{{ en: 'Total News', el: 'Σύνολο Ειδήσεων' }}</TranslatableText>
          </CardTitle>
          <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-700 mb-1">{newsCount}</div>
          <p className="text-xs text-blue-600/70">
            <TranslatableText>{{ en: 'Published articles', el: 'Δημοσιευμένα άρθρα' }}</TranslatableText>
          </p>
        </CardContent>
      </Card>
      
      <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-200/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700">
            <TranslatableText>{{ en: 'Total Events', el: 'Σύνολο Εκδηλώσεων' }}</TranslatableText>
          </CardTitle>
          <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
            <Calendar className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-700 mb-1">{eventsCount}</div>
          <p className="text-xs text-green-600/70">
            <TranslatableText>{{ en: 'Scheduled events', el: 'Προγραμματισμένες εκδηλώσεις' }}</TranslatableText>
          </p>
        </CardContent>
      </Card>
      
      <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-700">
            <TranslatableText>{{ en: 'Total Museums', el: 'Σύνολο Μουσείων' }}</TranslatableText>
          </CardTitle>
          <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
            <Landmark className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-700 mb-1">{museumsCount}</div>
          <p className="text-xs text-purple-600/70">
            <TranslatableText>{{ en: 'Registered museums', el: 'Εγγεγραμμένα μουσεία' }}</TranslatableText>
          </p>
        </CardContent>
      </Card>
      
      <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100/50 hover:from-orange-100 hover:to-orange-200/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-700">
            <TranslatableText>{{ en: 'Total Pages', el: 'Σύνολο Σελίδων' }}</TranslatableText>
          </CardTitle>
          <div className="p-2 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-colors">
            <Building className="h-4 w-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-700 mb-1">{pagesCount}</div>
          <p className="text-xs text-orange-600/70">
            <TranslatableText>{{ en: 'Municipality pages', el: 'Σελίδες δήμου' }}</TranslatableText>
          </p>
        </CardContent>
      </Card>
      
      <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-pink-50 to-pink-100/50 hover:from-pink-100 hover:to-pink-200/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-pink-700">
            <TranslatableText>{{ en: 'Categories', el: 'Κατηγορίες' }}</TranslatableText>
          </CardTitle>
          <div className="p-2 bg-pink-500/20 rounded-lg group-hover:bg-pink-500/30 transition-colors">
            <Tag className="h-4 w-4 text-pink-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-pink-700 mb-1">{categoriesCount}</div>
          <p className="text-xs text-pink-600/70">
            <TranslatableText>{{ en: 'Page categories', el: 'Κατηγορίες σελίδων' }}</TranslatableText>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}