'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import CaricaFoto from '@/components/CaricaFoto';

interface Props {
  onPubblicato?: () => void;
}

export default function CommunityComposer({ onPubblicato }: Props) {
  const { user } = useAuth();

  if (!user) {
    return (
      <section className="community-composer community-composer-guest">
        <p className="font-display text-lg font-black uppercase text-white">Entra in garage</p>
        <p className="mt-1 text-sm text-cemento/55">
          Accedi per pubblicare foto, condividere giri e reagire agli altri rider.
        </p>
        <Link href="/accedi" className="tap btn-primary mt-4 inline-block px-8 text-center">
          Accedi gratis
        </Link>
      </section>
    );
  }

  return (
    <section className="community-composer">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand">Pubblica ora</p>
      <p className="mt-1 font-display text-xl font-black uppercase leading-tight text-white">
        Cosa hai fatto oggi in sella?
      </p>
      <p className="mt-1 text-sm text-cemento/55">
        Una foto, un giro GPS o un commento su un itinerario — la community vive se condividiamo.
      </p>
      <div className="mt-4">
        <CaricaFoto compatto onCaricata={onPubblicato} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/traccia" className="tap community-composer-chip">
          Traccia un giro
        </Link>
        <Link href="/giri" className="tap community-composer-chip">
          Pubblica un giro
        </Link>
        <Link href="/itinerari" className="tap community-composer-chip">
          Commenta un itinerario
        </Link>
      </div>
    </section>
  );
}
