'use client';

import { useAuth } from './AuthProvider';
import Reveal from './Reveal';
import CardDemoAnteprima from './CardDemoAnteprima';
import CinematicScene from '@/components/cinematic/CinematicScene';
import CinematicHeadline from '@/components/cinematic/CinematicHeadline';
import { CINEMATIC } from '@/lib/cinematic-assets';

export default function SezioneCardEsempio() {
  const { user, loading } = useAuth();

  if (loading || user) return null;

  return (
    <CinematicScene
      src={CINEMATIC.card}
      vignette="section"
      minHeight="auto"
      className="cinematic-section-wrap"
    >
      <CinematicHeadline
        align="right"
        size="section"
        className="cinematic-section-deco pointer-events-none"
        lines={[
          { text: 'La card del', accent: false },
          { text: 'tuo giro', accent: true },
        ]}
      />
      <div className="cinematic-section-inner">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#ff6a20]/90">
            Esempio card social
          </p>
          <h2 className="mt-1 max-w-md font-display text-2xl font-bold uppercase tracking-tight text-white sm:text-4xl">
            Pronta per Instagram
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-cemento/75">
            A fine tracciamento GPS generi automaticamente km, tempo, curve e tracciato — formato 4:5.
          </p>
        </Reveal>
        <Reveal delay={80}>
          <CardDemoAnteprima className="mt-8" />
        </Reveal>
      </div>
    </CinematicScene>
  );
}
