import type { Badge } from '@/lib/badge';

/** Simbolo interno — tratti puliti, centrati, stile icona manuale. */
function SimboloBadge({ id }: { id: string }) {
  switch (id) {
    case 'chiave-in-mano':
      return (
        <g transform="translate(32 32)">
          <circle cx="0" cy="-7" r="7.5" fill="none" stroke="#d6d3d1" strokeWidth="2" />
          <circle cx="0" cy="-7" r="2.8" fill="#141210" stroke="#78716c" strokeWidth="1" />
          <rect x="-1.75" y="0" width="3.5" height="14" rx="1.2" fill="#d6d3d1" />
          <rect x="1.75" y="8" width="5" height="2.4" rx="0.6" fill="#d6d3d1" />
          <rect x="1.75" y="12" width="3.5" height="2.4" rx="0.6" fill="#d6d3d1" />
        </g>
      );
    case 'strada-aperta':
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 42 L32 25 L46 42" fill="none" stroke="#57534e" strokeWidth="2.2" />
          <path d="M32 25 L32 42" stroke="#f2b705" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="32" cy="21" r="2.2" fill="#f2b705" opacity="0.9" />
        </g>
      );
    case 'centauro-asfalto':
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <circle cx="23" cy="37" r="5.5" fill="none" stroke="#ED2100" strokeWidth="1.8" />
          <circle cx="41" cy="37" r="5.5" fill="none" stroke="#ED2100" strokeWidth="1.8" />
          <path
            d="M20 37 H26 L30 27 L36 30 L42 33 H44"
            fill="none"
            stroke="#f0f1f2"
            strokeWidth="1.8"
          />
          <path d="M30 27 L32 24" stroke="#ED2100" strokeWidth="1.4" />
        </g>
      );
    case 'conquistatore-passi':
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M13 41 L21 29 L29 35 L37 23 L45 33 L51 41"
            fill="rgba(87,83,78,0.35)"
            stroke="#a8a29e"
            strokeWidth="1.5"
          />
          <path d="M37 23 V17" stroke="#f2b705" strokeWidth="1.4" />
          <path d="M35 17 H39 L37 14 Z" fill="#f2b705" stroke="none" />
        </g>
      );
    case 're-delle-curve':
      return (
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M19 40 C19 30 27 26 35 30 C43 34 41 24 33 21"
            stroke="#ED2100"
            strokeWidth="2.2"
          />
          <path
            d="M33 21 L37 19 M33 21 L31 17"
            stroke="#f2b705"
            strokeWidth="1.5"
          />
        </g>
      );
    case 'leggenda-in-sella':
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M21 36 C21 28 43 28 43 36 V39 H21 Z"
            fill="rgba(237,33,0,0.12)"
            stroke="#d6d3d1"
            strokeWidth="1.6"
          />
          <path d="M21 36 H43" stroke="#78716c" strokeWidth="1.3" />
          <path d="M25 36 C27 31 37 31 39 36" fill="none" stroke="#78716c" strokeWidth="1.2" />
          <ellipse cx="32" cy="30" rx="9" ry="3" fill="none" stroke="#ED2100" strokeWidth="1.2" opacity="0.7" />
        </g>
      );
    case 'divinita-bitume':
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M32 17 L35 26 H43 L37 31 L39 41 L32 36 L25 41 L27 31 L21 26 H29 Z"
            fill="rgba(237,33,0,0.2)"
            stroke="#ED2100"
            strokeWidth="1.4"
          />
          <circle cx="32" cy="30" r="4" fill="none" stroke="#fde68a" strokeWidth="1.2" />
          <path d="M32 13 V16 M32 41 V44 M18 30 H21 M43 30 H46" stroke="#fde68a" strokeWidth="1.3" />
        </g>
      );
    default:
      return null;
  }
}

/** Badge SVG — cornice più elaborata ad ogni rango (0 → 6). */
export default function IconaBadgeLivello({
  badge,
  size = 72,
  className = '',
}: {
  badge: Pick<Badge, 'id' | 'rango'>;
  size?: number;
  className?: string;
}) {
  const r = badge.rango;
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
      <defs>
        <linearGradient id={`${uid}-metal`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e7e5e4" />
          <stop offset="100%" stopColor="#57534e" />
        </linearGradient>
        <linearGradient id={`${uid}-brand`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff5533" />
          <stop offset="100%" stopColor="#b81800" />
        </linearGradient>
        {r >= 6 && (
          <radialGradient id={`${uid}-glow`} cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#ED2100" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ED2100" stopOpacity="0" />
          </radialGradient>
        )}
      </defs>

      {r >= 6 && <circle cx="32" cy="32" r="29" fill={`url(#${uid}-glow)`} />}

      {r >= 5 && (
        <g>
          <path
            d="M17 15 L21 9 L26 14 L32 7 L38 14 L43 9 L47 15 L45 19 H19 Z"
            fill={`url(#${uid}-brand)`}
            stroke="#fecaca"
            strokeWidth="0.7"
          />
          <circle cx="21" cy="11" r="1" fill="#fde68a" />
          <circle cx="32" cy="9" r="1.2" fill="#fde68a" />
          <circle cx="43" cy="11" r="1" fill="#fde68a" />
        </g>
      )}

      {r >= 4 && (
        <path
          d="M32 8 L49 17 V37 L32 50 L15 37 V17 Z"
          fill="none"
          stroke={`url(#${uid}-metal)`}
          strokeWidth="1.3"
        />
      )}

      {r >= 3 && (
        <path
          d="M32 12 C41 12 47 18 47 27 C47 39 32 49 32 49 C32 49 17 39 17 27 C17 18 23 12 32 12 Z"
          fill="#141210"
          stroke={`url(#${uid}-brand)`}
          strokeWidth={r >= 5 ? 1.5 : 1.1}
        />
      )}

      {r >= 2 && (
        <path
          d="M32 16 C39 16 43 20 43 27 C43 35 32 44 32 44 C32 44 21 35 21 27 C21 20 25 16 32 16 Z"
          fill={r >= 4 ? 'rgba(237,33,0,0.1)' : 'rgba(255,255,255,0.03)'}
          stroke="#78716c"
          strokeWidth="0.75"
        />
      )}

      {r >= 1 && (
        <>
          <circle cx="32" cy="32" r="25" fill="none" stroke={`url(#${uid}-metal)`} strokeWidth="1.1" />
          <circle cx="32" cy="32" r="21" fill="none" stroke="rgba(237,33,0,0.3)" strokeWidth="0.55" strokeDasharray="2.5 2" />
        </>
      )}

      {r === 0 && (
        <circle cx="32" cy="32" r="23" fill="rgba(255,255,255,0.03)" stroke="#78716c" strokeWidth="1.3" />
      )}

      {r >= 5 && (
        <path
          d="M32 19 C37 19 40 22 40 28 C40 34 32 40 32 40 C32 40 24 34 24 28 C24 22 27 19 32 19 Z"
          fill="none"
          stroke="#fecaca"
          strokeWidth="0.6"
          opacity="0.65"
        />
      )}

      <SimboloBadge id={badge.id} />

      {r >= 4 && (
        <>
          {[[15, 17], [49, 17], [15, 45], [49, 45]].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.2" fill="#d6d3d1" />
          ))}
        </>
      )}
    </svg>
  );
}
