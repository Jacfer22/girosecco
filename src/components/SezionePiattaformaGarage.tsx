import Link from 'next/link';
import Reveal from '@/components/Reveal';
import IconaGpsLive from '@/components/icons/IconaGpsLive';
import CinematicScene from '@/components/cinematic/CinematicScene';
import CinematicHeadline from '@/components/cinematic/CinematicHeadline';
import { CINEMATIC } from '@/lib/cinematic-assets';

const SATELLITI = [
  {
    href: '/traccia',
    titolo: 'Traccia un giro',
    desc: 'GPS live, statistiche e card condivisibile per Instagram e TikTok.',
    pos: 'top' as const,
  },
  {
    href: '/itinerari',
    titolo: 'Itinerari',
    desc: 'Mappe, tappe, avvisi strada. GPX su itinerari verificati.',
    pos: 'left' as const,
  },
  {
    href: '/community',
    titolo: 'Community',
    desc: 'Foto, giri pubblici e commenti dalla community di biker.',
    pos: 'right' as const,
  },
];

function IconaGarageLucchetto() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-[#ff6a20]">
      <path
        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8 21V10c0-1 .5-2 2-2h4c1.5 0 2 1 2 2v11" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10" y="13" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.9" />
      <path
        d="M14 8V7a2 2 0 0 0-4 0v1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SezionePiattaformaGarage() {
  return (
    <CinematicScene
      src={CINEMATIC.navigazione}
      vignette="section"
      minHeight="auto"
      className="cinematic-section-wrap"
    >
      <CinematicHeadline
        align="left"
        size="section"
        className="cinematic-section-deco pointer-events-none"
        lines={[
          { text: 'Navigazione', accent: false },
          { text: 'gps live', accent: true },
        ]}
      />
      <div className="cinematic-section-inner">
        <Reveal>
          <p className="text-center font-mono text-xs uppercase tracking-[0.22em] text-[#ff6a20]/85">
            Cosa puoi fare
          </p>
        </Reveal>

        <div className="landing-garage-hub mt-8 sm:mt-10">
          {SATELLITI.filter((s) => s.pos === 'top').map((item) => (
            <Reveal key={item.href} delay={40}>
              <Link href={item.href} className="landing-garage-sat landing-garage-sat-top group cinematic-sat-card">
                <IconaGpsLive size={28} className="text-[#ff6a20]" />
                <h3 className="mt-3 font-display text-lg font-bold uppercase tracking-tight text-white group-hover:text-[#ff6a20] sm:text-xl">
                  {item.titolo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cemento/70">{item.desc}</p>
                <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-cemento/45 group-hover:text-[#ff6a20]">
                  Scopri →
                </span>
              </Link>
            </Reveal>
          ))}

          <Reveal delay={80}>
            <Link href="/accedi#registrati" className="landing-garage-core group cinematic-sat-core">
              <IconaGarageLucchetto />
              <h2 className="mt-4 font-display text-2xl font-black uppercase leading-tight tracking-tight text-white group-hover:text-[#ff6a20] sm:text-3xl lg:text-4xl">
                Il tuo garage digitale
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-cemento/70">
                Avatar 3D della tua moto, officina virtuale e garage personale — sblocca con un account gratuito.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#ff6a20]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                Registrati subito
              </span>
            </Link>
          </Reveal>

          {SATELLITI.filter((s) => s.pos !== 'top').map((item, i) => (
            <Reveal key={item.href} delay={120 + i * 40}>
              <Link
                href={item.href}
                className={`landing-garage-sat group cinematic-sat-card ${item.pos === 'left' ? 'landing-garage-sat-left' : 'landing-garage-sat-right'}`}
              >
                <h3 className="font-display text-lg font-bold uppercase tracking-tight text-white group-hover:text-[#ff6a20] sm:text-xl">
                  {item.titolo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cemento/70">{item.desc}</p>
                <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-cemento/45 group-hover:text-[#ff6a20]">
                  Scopri →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </CinematicScene>
  );
}
