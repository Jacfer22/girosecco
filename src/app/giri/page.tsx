import { Suspense } from 'react';
import AppPageShell from '@/components/AppPageShell';
import { AuthWallLoading } from '@/components/AuthWall';
import GiriPageClient from './GiriPageClient';

export default function PaginaMieiGiri() {
  return (
    <Suspense
      fallback={
        <AppPageShell>
          <AuthWallLoading />
        </AppPageShell>
      }
    >
      <GiriPageClient />
    </Suspense>
  );
}
