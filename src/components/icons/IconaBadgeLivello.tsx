import type { Badge } from '@/lib/badge';

const O = {
  gold: '#c9a227',
  goldHi: '#e8c547',
  goldLo: '#8a7020',
  red: '#ED2100',
  redLo: '#b81800',
  dash: '#f2b705',
  bg: '#1e1b19',
  bgHi: '#2a2624',
};

function Corona({ y = 10 }: { y?: number }) {
  return (
    <g transform={`translate(0,${y})`}>
      <path
        d="M16 12 L20 6 L25 11 L32 4 L39 11 L44 6 L48 12 L46 15 H18 Z"
        fill={O.redLo}
        stroke={O.goldHi}
        strokeWidth="0.65"
      />
      <circle cx="20" cy="8" r="0.9" fill={O.dash} />
      <circle cx="32" cy="6" r="1.1" fill={O.dash} />
      <circle cx="44" cy="8" r="0.9" fill={O.dash} />
    </g>
  );
}

function CoronaStella({ y = 8 }: { y?: number }) {
  return (
    <g transform={`translate(0,${y})`}>
      <path
        d="M14 13 L19 5 L25 12 L32 3 L39 12 L45 5 L50 13 L47 16 H17 Z"
        fill={O.redLo}
        stroke={O.goldHi}
        strokeWidth="0.7"
      />
      <path
        d="M32 6 L33.2 9 H36.5 L34 11 L34.8 14 L32 12.2 L29.2 14 L30 11 L27.5 9 H30.8 Z"
        fill={O.red}
        stroke={O.goldHi}
        strokeWidth="0.35"
      />
    </g>
  );
}

function Alloro() {
  return (
    <>
      <path
        d="M10 28 C8 24 9 20 12 18 C11 22 12 25 14 28 C12 27 11 28 10 28 Z"
        fill="none"
        stroke={O.gold}
        strokeWidth="0.7"
      />
      <path
        d="M54 28 C56 24 55 20 52 18 C53 22 52 25 50 28 C52 27 53 28 54 28 Z"
        fill="none"
        stroke={O.gold}
        strokeWidth="0.7"
      />
      <path d="M11 22 C13 26 14 30 13 34" stroke={O.goldLo} strokeWidth="0.55" fill="none" />
      <path d="M53 22 C51 26 50 30 51 34" stroke={O.goldLo} strokeWidth="0.55" fill="none" />
    </>
  );
}

function SimboloBadge({ id }: { id: string }) {
  switch (id) {
    case 'chiave-in-mano':
      /* Chiave orizzontale — oro, compatta */
      return (
        <g transform="translate(32 32)">
          <circle cx="-7" cy="0" r="5.5" fill={O.bg} stroke={O.gold} strokeWidth="1.35" />
          <circle cx="-7" cy="0" r="1.8" fill={O.bgHi} stroke={O.goldLo} strokeWidth="0.6" />
          <path d="M-1.5 0 H11" stroke={O.gold} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M11 0 V2.5 M7.5 0 V2.5" stroke={O.gold} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    case 'strada-aperta':
      return (
        <g>
          <path d="M23 41 L32 29 L41 41 Z" fill={O.bgHi} stroke={O.goldLo} strokeWidth="0.8" />
          <path d="M27 41 L32 32 L37 41" fill="none" stroke={O.gold} strokeWidth="0.55" opacity="0.5" />
          <path d="M32 31 L32 41" stroke={O.dash} strokeWidth="0.9" strokeDasharray="1.8 1.8" strokeLinecap="round" />
        </g>
      );
    case 'centauro-asfalto':
      return (
        <g fill="none" stroke={O.gold} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="22" cy="38" r="4.2" strokeWidth="1.3" />
          <circle cx="42" cy="38" r="4.2" strokeWidth="1.3" />
          <path d="M18 38 H24 L28 28 H34 L38 31 L44 34 H46" strokeWidth="1.35" />
          <path d="M28 28 L30 25" stroke={O.red} strokeWidth="1" />
          <ellipse cx="33" cy="30" rx="3" ry="1.5" strokeWidth="0.9" opacity="0.7" />
        </g>
      );
    case 'conquistatore-passi':
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M14 40 L20 31 L27 35 L34 24 L40 30 L46 40 Z"
            fill={O.bgHi}
            stroke={O.gold}
            strokeWidth="1"
          />
          <path d="M34 24 V18" stroke={O.gold} strokeWidth="0.9" />
          <path d="M32.5 18 H35.5 L34 15.5 Z" fill={O.red} stroke="none" />
        </g>
      );
    case 're-delle-curve':
      return (
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M20 40 C20 31 28 28 34 31 C40 34 39 25 33 22"
            stroke={O.red}
            strokeWidth="2.4"
          />
          <path d="M33 22 L37 21 M33 22 L31.5 18.5" stroke={O.goldHi} strokeWidth="1.1" />
        </g>
      );
    case 'leggenda-in-sella':
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M22 37 C22 29 42 29 42 37 V39 H22 Z"
            fill={O.bgHi}
            stroke={O.gold}
            strokeWidth="1.2"
          />
          <path d="M22 36 H42" stroke={O.goldLo} strokeWidth="0.8" />
          <path d="M26 36 C28 32 36 32 38 36" fill="none" stroke={O.gold} strokeWidth="0.9" />
          <path d="M24 31 C28 27 36 27 40 31" fill="none" stroke={O.goldHi} strokeWidth="0.85" />
        </g>
      );
    case 'divinita-bitume':
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 38 C24 32 40 32 40 38" fill={O.bgHi} stroke={O.gold} strokeWidth="1" />
          <circle cx="32" cy="34" r="3.5" fill={O.bg} stroke={O.goldHi} strokeWidth="1" />
          <path d="M28 34 H36" stroke={O.goldLo} strokeWidth="0.7" />
          <path d="M18 30 L21 36 M18 36 L21 30" stroke={O.red} strokeWidth="1.2" />
          <path d="M46 30 L43 36 M46 36 L43 30" stroke={O.red} strokeWidth="1.2" />
        </g>
      );
    default:
      return null;
  }
}

function CorniceBadge({ r, uid }: { r: number; uid: string }) {
  if (r === 0) {
    return (
      <circle cx="32" cy="32" r="22" fill={O.bg} stroke={O.gold} strokeWidth="1.35" />
    );
  }
  if (r === 1) {
    return (
      <>
        <circle cx="32" cy="32" r="24" fill="none" stroke={O.gold} strokeWidth="1.35" />
        <circle cx="32" cy="32" r="20" fill={O.bg} stroke={O.red} strokeWidth="0.65" opacity="0.85" />
      </>
    );
  }
  if (r === 2) {
    return (
      <>
        <path
          d="M32 14 C40 14 45 19 45 27 C45 36 32 46 32 46 C32 46 19 36 19 27 C19 19 24 14 32 14 Z"
          fill={O.bg}
          stroke={O.gold}
          strokeWidth="1.25"
        />
        <path
          d="M32 17 C38 17 42 21 42 27 C42 33 32 42 32 42 C32 42 22 33 22 27 C22 21 26 17 32 17 Z"
          fill="none"
          stroke={O.red}
          strokeWidth="0.55"
          opacity="0.75"
        />
      </>
    );
  }
  if (r === 3) {
    return (
      <>
        <path
          d="M32 12 C41 12 47 18 47 27 C47 38 32 48 32 48 C32 48 17 38 17 27 C17 18 23 12 32 12 Z"
          fill={O.bg}
          stroke={O.goldHi}
          strokeWidth="1.35"
        />
        <path
          d="M32 15 C39 15 44 20 44 27 C44 34 32 44 32 44 C32 44 20 34 20 27 C20 20 25 15 32 15 Z"
          fill="none"
          stroke={O.red}
          strokeWidth="0.6"
        />
      </>
    );
  }
  if (r === 4) {
    return (
      <>
        <path
          d="M32 10 L48 18 V34 L32 46 L16 34 V18 Z"
          fill={O.bg}
          stroke={O.gold}
          strokeWidth="1.25"
        />
        <path
          d="M32 13 L45 19.5 V32.5 L32 42 L19 32.5 V19.5 Z"
          fill="none"
          stroke={O.red}
          strokeWidth="0.55"
        />
      </>
    );
  }
  if (r === 5) {
    return (
      <>
        <Corona y={9} />
        <Alloro />
        <path
          d="M32 14 C40 14 45 19 45 27 C45 36 32 45 32 45 C32 45 19 36 19 27 C19 19 24 14 32 14 Z"
          fill={O.bg}
          stroke={O.goldHi}
          strokeWidth="1.3"
        />
        <path
          d="M32 17 C38 17 42 21 42 27 C42 33 32 41 32 41 C32 41 22 33 22 27 C22 21 26 17 32 17 Z"
          fill="none"
          stroke={O.red}
          strokeWidth="0.55"
        />
      </>
    );
  }
  /* r === 6 */
  return (
    <>
      <defs>
        <radialGradient id={`${uid}-aura`} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor={O.red} stopOpacity="0.18" />
          <stop offset="100%" stopColor={O.red} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill={`url(#${uid}-aura)`} />
      <CoronaStella y={6} />
      <Alloro />
      <path
        d="M32 11 C42 11 49 18 49 28 C49 39 32 49 32 49 C32 49 15 39 15 28 C15 18 22 11 32 11 Z"
        fill={O.bg}
        stroke={O.goldHi}
        strokeWidth="1.45"
      />
      <path
        d="M32 14 C40 14 46 19 46 28 C46 36 32 45 32 45 C32 45 18 36 18 28 C18 19 24 14 32 14 Z"
        fill="none"
        stroke={O.gold}
        strokeWidth="0.65"
      />
      <path
        d="M32 17 C37 17 41 21 41 28 C41 34 32 41 32 41 C32 41 23 34 23 28 C23 21 27 17 32 17 Z"
        fill="none"
        stroke={O.red}
        strokeWidth="0.5"
        opacity="0.8"
      />
    </>
  );
}

/** Badge stile anteprima: oro/rosso, icona piccola e definita. */
export default function IconaBadgeLivello({
  badge,
  size = 52,
  className = '',
}: {
  badge: Pick<Badge, 'id' | 'rango'>;
  size?: number;
  className?: string;
}) {
  const uid = badge.id.replace(/[^a-z0-9]/gi, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <CorniceBadge r={badge.rango} uid={uid} />
      <SimboloBadge id={badge.id} />
    </svg>
  );
}
