'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppPageShell from '@/components/AppPageShell';
import { AuthWallLoading } from '@/components/AuthWall';
import DashboardHome from '@/components/DashboardHome';
import { useAuth } from '@/components/AuthProvider';

export default function PaginaHub() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <AppPageShell width="full" className="min-h-[60vh]">
        <AuthWallLoading />
      </AppPageShell>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppPageShell width="full" className="!pb-4">
      <DashboardHome />
    </AppPageShell>
  );
}
