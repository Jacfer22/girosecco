'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import type { GarageMoto } from '@/lib/garage';
import TuningGarageScene from '@/components/TuningGarageScene';

const GarageModelViewer = dynamic(() => import('@/components/GarageModelViewer'), {
  ssr: false,
  loading: () => <div className="garage-stage-loader" />,
});

interface Props {
  motoPronte: GarageMoto[];
  selezionataId: string | null;
  onSeleziona: (id: string) => void;
  fotoAnteprima?: string | null;
  children?: React.ReactNode;
}

export default function GarageAmbiente({
  motoPronte,
  selezionataId,
  onSeleziona,
  fotoAnteprima,
  children,
}: Props) {
  const motoInPalco = useMemo(() => {
    if (motoPronte.length === 0) return [];
    const scelta = selezionataId
      ? motoPronte.find((item) => item.id === selezionataId)
      : motoPronte[0];
    return scelta ? [scelta] : [motoPronte[0]];
  }, [motoPronte, selezionataId]);

  const haModello = motoInPalco.length > 0;

  return (
    <TuningGarageScene variant="garage" className="garage-tuning-wrap">
      <div className="garage-palco-hero">
        {haModello ? (
          <GarageModelViewer
            moto={motoInPalco}
            selezionataId={selezionataId ?? motoInPalco[0]?.id ?? null}
            onSeleziona={onSeleziona}
            modalitaHero
          />
        ) : fotoAnteprima ? (
          <div className="garage-anteprima-foto">
            <img src={fotoAnteprima} alt="Anteprima moto" />
            <p className="garage-anteprima-label">In attesa del gemello 3D</p>
          </div>
        ) : (
          <div className="garage-palco-vuoto">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
              Nessuna moto nel garage
            </p>
          </div>
        )}
      </div>

      <div className="garage-ui-layer">{children}</div>
    </TuningGarageScene>
  );
}
