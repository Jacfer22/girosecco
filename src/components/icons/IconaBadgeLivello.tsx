import type { Badge } from '@/lib/badge';

const O = {
  gold: '#c9a227',
  goldHi: '#e8c547',
  goldLo: '#8a7020',
  red: '#ED2100',
  redLo: '#b81800',
  dash: '#f2b705',
  bg: '#1a1816',
  bgHi: '#252220',
};

function GoldGrad({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={O.goldHi} />
        <stop offset="45%" stopColor={O.gold} />
        <stop offset="100%" stopColor={O.goldLo} />
      </linearGradient>
    </defs>
  );
}

function Corona({ y = 10 }: { y?: number }) {
  return (
    <g transform={`translate(0,${y})`}>
      <path
        d="M15 12 L19 5 L24 10 L32 3 L40 10 L45 5 L49 12 L47 15 H17 Z"
        fill={O.redLo}
        stroke={O.goldHi}
        strokeWidth="0.7"
      />
      <circle cx="19" cy="7.5" r="0.85" fill={O.dash} />
      <circle cx="32" cy="5.5" r="1" fill={O.red} />
      <circle cx="45" cy="7.5" r="0.85" fill={O.dash} />
    </g>
  );
}

function CoronaStella({ y = 7 }: { y?: number }) {
  return (
    <g transform={`translate(0,${y})`}>
      <path
        d="M13 13 L18 4 L25 11 L32 2 L39 11 L46 4 L51 13 L48 16 H16 Z"
        fill={O.redLo}
        stroke={O.goldHi}
        strokeWidth="0.75"
      />
      <path
        d="M32 5 L33.4 8.5 H37 L34.2 10.8 L35.2 14.5 L32 12.3 L28.8 14.5 L29.8 10.8 L27 8.5 H30.6 Z"
        fill={O.red}
        stroke={O.goldHi}
        strokeWidth="0.35"
      />
    </g>
  );
}

function Alloro({ amp = 1 }: { amp?: number }) {
  const s = amp;
  return (
    <>
      <path
        d={`M${10 * s} 30 C${7 * s} 26 ${8 * s} 21 ${12 * s} 18 C${10 * s} 23 ${11 * s} 27 ${14 * s} 30 C${12 * s} 29 ${11 * s} 30 ${10 * s} 30 Z`}
        fill="none"
        stroke={`url(#alloro-g)`}
        strokeWidth="0.75"
      />
      <path
        d={`M${54 * s} 30 C${57 * s} 26 ${56 * s} 21 ${52 * s} 18 C${54 * s} 23 ${53 * s} 27 ${50 * s} 30 C${52 * s} 29 ${53 * s} 30 ${54 * s} 30 Z`}
        fill="none"
        stroke={`url(#alloro-g)`}
        strokeWidth="0.75"
      />
      <path d={`M${11 * s} 24 C${13 * s} 28 ${14 * s} 32 ${13 * s} 36`} stroke={O.goldLo} strokeWidth="0.5" fill="none" />
      <path d={`M${53 * s} 24 C${51 * s} 28 ${50 * s} 32 ${51 * s} 36`} stroke={O.goldLo} strokeWidth="0.5" fill="none" />
      <ellipse cx={8 * s} cy={22 * s} rx="1.2" ry="2" fill="none" stroke={O.gold} strokeWidth="0.45" />
      <ellipse cx={56 * s} cy={22 * s} rx="1.2" ry="2" fill="none" stroke={O.gold} strokeWidth="0.45" />
    </>
  );
}

function SimboloBadge({ id }: { id: string }) {
  switch (id) {
    case 'chiave-in-mano':
      return (
        <g transform="translate(32 33) rotate(-35)">
          <circle cx="-6" cy="0" r="5" fill={O.bg} stroke={O.goldHi} strokeWidth="1.2" />
          <circle cx="-6" cy="0" r="1.6" fill={O.bgHi} stroke={O.goldLo} strokeWidth="0.5" />
          <path d="M-1 0 H10" stroke={O.goldHi} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M10 0 V2.2 M7 0 V2.2" stroke={O.goldHi} strokeWidth="1.3" strokeLinecap="round" />
        </g>
      );
    case 'strada-aperta':
      return (
        <g>
          <path d="M20 42 L32 28 L44 42 Z" fill={O.bgHi} stroke={O.goldLo} strokeWidth="0.6" />
          <path d="M24 42 L32 31 L40 42" fill="none" stroke={O.gold} strokeWidth="0.5" opacity="0.45" />
          <path
            d="M32 30 L32 42"
            stroke={O.dash}
            strokeWidth="1"
            strokeDasharray="2 2"
            strokeLinecap="round"
          />
        </g>
      );
    case 'centauro-asfalto':
      return (
        <g fill="none" stroke={O.goldHi} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="21" cy="39" r="3.8" strokeWidth="1.2" />
          <circle cx="43" cy="39" r="3.8" strokeWidth="1.2" />
          <path
            d="M17 39 H23 L27 30 H33 L36 28 L40 30 L44 33 H47"
            strokeWidth="1.25"
          />
          <path d="M27 30 L29 27" stroke={O.red} strokeWidth="0.9" />
          <path d="M33 28 L35 26" stroke={O.gold} strokeWidth="0.7" />
          <ellipse cx="34" cy="31" rx="2.5" ry="1.2" strokeWidth="0.75" opacity="0.6" />
        </g>
      );
    case 'conquistatore-passi':
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M12 41 L18 33 L24 36 L30 28 L36 32 L42 26 L48 30 L52 41 Z"
            fill={O.bgHi}
            stroke={O.gold}
            strokeWidth="0.85"
          />
          <path
            d="M30 28 C34 32 38 34 42 30"
            fill="none"
            stroke={O.goldLo}
            strokeWidth="0.7"
            strokeDasharray="1.5 1"
          />
          <path d="M42 26 V20" stroke={O.goldHi} strokeWidth="0.85" />
          <path d="M40.5 20 H43.5 L42 17 Z" fill={O.red} stroke="none" />
        </g>
      );
    case 're-delle-curve':
      return (
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M19 41 C19 32 27 29 33 32 C39 35 38 26 32 23"
            stroke={O.red}
            strokeWidth="2.6"
          />
          <path d="M32 23 L36.5 22 M32 23 L30 19" stroke={O.goldHi} strokeWidth="1.15" />
        </g>
      );
    case 'leggenda-in-sella':
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M23 38 C23 30 41 30 41 38 V40 H23 Z"
            fill={O.bgHi}
            stroke={O.goldHi}
            strokeWidth="1.15"
          />
          <path d="M23 37 H41" stroke={O.goldLo} strokeWidth="0.75" />
          <path
            d="M26 37 C28 33 36 33 38 37"
            fill="none"
            stroke={O.gold}
            strokeWidth="0.85"
          />
          <path
            d="M24 32 C28 28 36 28 40 32"
            fill="none"
            stroke={O.goldHi}
            strokeWidth="0.9"
          />
          <ellipse cx="32" cy="34" rx="4" ry="2.5" fill="none" stroke={O.gold} strokeWidth="0.65" />
        </g>
      );
    case 'divinita-bitume':
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M23 39 C23 33 41 33 41 39"
            fill={O.bgHi}
            stroke={O.goldHi}
            strokeWidth="1"
          />
          <ellipse cx="32" cy="35" rx="5" ry="3.5" fill={O.bg} stroke={O.goldHi} strokeWidth="0.9" />
          <circle cx="29" cy="34.5" r="1.3" fill="#fff" opacity="0.9" />
          <circle cx="35" cy="34.5" r="1.3" fill="#fff" opacity="0.9" />
          <path d="M28 37 H36" stroke={O.goldLo} strokeWidth="0.65" />
          <path d="M17 31 L20 37 M17 37 L20 31" stroke={O.red} strokeWidth="1.35" />
          <path d="M47 31 L44 37 M47 37 L44 31" stroke={O.red} strokeWidth="1.35" />
        </g>
      );
    default:
      return null;
  }
}

function CorniceBadge({ r, uid }: { r: number; uid: string }) {
  const g = `url(#${uid}-g)`;

  if (r === 0) {
    return (
      <>
        <GoldGrad id={uid} />
        <circle cx="32" cy="32" r="22" fill={O.bg} stroke={g} strokeWidth="1.5" />
      </>
    );
  }
  if (r === 1) {
    return (
      <>
        <GoldGrad id={uid} />
        <circle cx="32" cy="32" r="24" fill="none" stroke={g} strokeWidth="1.4" />
        <circle cx="32" cy="32" r="20" fill={O.bg} stroke={O.red} strokeWidth="0.7" />
      </>
    );
  }
  if (r === 2) {
    return (
      <>
        <GoldGrad id={uid} />
        <path
          d="M32 14 C40 14 45 19 45 27 C45 36 32 46 32 46 C32 46 19 36 19 27 C19 19 24 14 32 14 Z"
          fill={O.bg}
          stroke={g}
          strokeWidth="1.35"
        />
        <path
          d="M32 17 C38 17 42 21 42 27 C42 33 32 42 32 42 C32 42 22 33 22 27 C22 21 26 17 32 17 Z"
          fill="none"
          stroke={O.red}
          strokeWidth="0.6"
          opacity="0.85"
        />
      </>
    );
  }
  if (r === 3) {
    return (
      <>
        <GoldGrad id={uid} />
        <path
          d="M32 10 L38 13 L44 12 L47 18 L47 27 C47 38 32 48 32 48 C32 48 17 38 17 27 L17 18 L20 12 L26 13 Z"
          fill={O.bg}
          stroke={g}
          strokeWidth="1.35"
        />
        <path
          d="M32 14 L37 16 L41 15 L43 19 L43 27 C43 35 32 44 32 44 C32 44 21 35 21 27 L21 19 L23 15 L27 16 Z"
          fill="none"
          stroke={O.red}
          strokeWidth="0.55"
        />
      </>
    );
  }
  if (r === 4) {
    return (
      <>
        <GoldGrad id={uid} />
        <path
          d="M32 10 L48 18 V34 L32 46 L16 34 V18 Z"
          fill={O.bg}
          stroke={g}
          strokeWidth="1.35"
        />
        <path
          d="M32 13 L45 19.5 V32.5 L32 42 L19 32.5 V19.5 Z"
          fill="none"
          stroke={O.red}
          strokeWidth="0.6"
        />
      </>
    );
  }
  if (r === 5) {
    return (
      <>
        <GoldGrad id={uid} />
        <defs>
          <linearGradient id="alloro-g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={O.goldHi} />
            <stop offset="100%" stopColor={O.goldLo} />
          </linearGradient>
        </defs>
        <Corona y={9} />
        <Alloro amp={1} />
        <path
          d="M32 14 C40 14 45 19 45 27 C45 36 32 45 32 45 C32 45 19 36 19 27 C19 19 24 14 32 14 Z"
          fill={O.bg}
          stroke={g}
          strokeWidth="1.35"
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
  return (
    <>
      <GoldGrad id={uid} />
      <defs>
        <linearGradient id="alloro-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={O.goldHi} />
          <stop offset="100%" stopColor={O.goldLo} />
        </linearGradient>
        <radialGradient id={`${uid}-aura`} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor={O.red} stopOpacity="0.15" />
          <stop offset="100%" stopColor={O.red} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill={`url(#${uid}-aura)`} />
      <CoronaStella y={5} />
      <Alloro amp={1.05} />
      <path
        d="M32 11 C42 11 49 18 49 28 C49 39 32 49 32 49 C32 49 15 39 15 28 C15 18 22 11 32 11 Z"
        fill={O.bg}
        stroke={g}
        strokeWidth="1.5"
      />
      <path
        d="M32 14 C40 14 46 19 46 28 C46 36 32 45 32 45 C32 45 18 36 18 28 C18 19 24 14 32 14 Z"
        fill="none"
        stroke={O.gold}
        strokeWidth="0.7"
      />
      <path
        d="M32 17 C37 17 41 21 41 28 C41 34 32 41 32 41 C32 41 23 34 23 28 C23 21 27 17 32 17 Z"
        fill="none"
        stroke={O.red}
        strokeWidth="0.5"
        opacity="0.85"
      />
    </>
  );
}

/** Badge stile anteprima: oro/rosso, cornici e simboli come mockup ufficiale. */
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
