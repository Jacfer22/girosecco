'use client';

import AppPageShell from '@/components/AppPageShell';
import AuthWall, { AuthWallLoading } from '@/components/AuthWall';
import DashboardHome from '@/components/DashboardHome';
import { useAuth } from '@/components/AuthProvider';

export default function PaginaHub() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <AppPageShell width="full" className="min-h-[60vh]">
        <AuthWallLoading />
      </AppPageShell>
    );
  }

  if (!user) {
    return (
      <AppPageShell width="full">
        <AuthWall
          titolo="Il tuo cockpit"
          descrizione="Accedi per aprire la home personale: garage, giri, traccia e community."
        />
      </AppPageShell>
    );
  }

  return (
    <AppPageShell width="full" className="!pb-4">
      <DashboardHome />
    </AppPageShell>
  );
}
