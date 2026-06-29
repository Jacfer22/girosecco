'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { GarageMoto } from '@/lib/garage';
import TuningGarageScene from '@/components/TuningGarageScene';
import CinematicHeadline from '@/components/cinematic/CinematicHeadline';

const GarageModelViewer = dynamic(() => import('@/components/GarageModelViewer'), {
  ssr: false,
  loading: () => <div className="garage-stage-loader" />,
});

interface Props {
  motoPronte: GarageMoto[];
  selezionataId: string | null;
  onSeleziona: (id: string) => void;
  fotoAnteprima?: string | null;
  mostraViewer?: boolean;
  onVetrinaSalvata?: () => void;
  children?: React.ReactNode;
}

export default function GarageAmbiente({
  motoPronte,
  selezionataId,
  onSeleziona,
  fotoAnteprima,
  mostraViewer = true,
  onVetrinaSalvata,
  children,
}: Props) {
  const [esploraAttivo, setEsploraAttivo] = useState(false);
  const selezionataPrecedente = useRef(selezionataId);

  useEffect(() => {
    if (selezionataPrecedente.current !== selezionataId) {
      setEsploraAttivo(false);
      selezionataPrecedente.current = selezionataId;
    }
  }, [selezionataId]);

  const haModello = mostraViewer && motoPronte.length > 0;
  const idAttivo = selezionataId ?? motoPronte[0]?.id ?? null;

  function interagisciMoto(id: string) {
    if (id === idAttivo && !esploraAttivo) {
      setEsploraAttivo(true);
      return;
    }
    setEsploraAttivo(false);
    onSeleziona(id);
  }

  return (
    <TuningGarageScene variant="garage" className="garage-tuning-wrap">
      <CinematicHeadline
        align="left"
        size="garage"
        className="garage-cinematic-title pointer-events-none"
        lines={[
          { text: 'Il mio', accent: false },
          { text: 'garage', accent: true },
        ]}
      />
      <div className="garage-palco-hero">
        {haModello ? (
          <>
            <GarageModelViewer
              moto={motoPronte}
              selezionataId={idAttivo}
              onSeleziona={interagisciMoto}
              modalitaHero
              esploraAttivo={esploraAttivo}
              onAttivaEsplora={() => setEsploraAttivo(true)}
              motoIdVetrina={idAttivo}
              onVetrinaSalvata={onVetrinaSalvata}
            />
            {!esploraAttivo && (
              <div className="garage-parcheggio-hint pointer-events-none">
                <span className="garage-parcheggio-hint-pill">
                  {idAttivo ? 'Tocca la moto per girarla' : 'Seleziona una moto'}
                </span>
              </div>
            )}
          </>
        ) : fotoAnteprima ? (
          <div className="garage-anteprima-foto">
            <img src={fotoAnteprima} alt="Anteprima moto" />
            <p className="garage-anteprima-label">In attesa dell&apos;avatar 3D</p>
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
