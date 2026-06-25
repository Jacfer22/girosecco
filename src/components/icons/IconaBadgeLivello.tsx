import type { Badge } from '@/lib/badge';
import { immagineBadge } from '@/lib/badge';

/** Badge da PNG mockup ufficiale (public/badges/). */
export default function IconaBadgeLivello({
  badge,
  size = 52,
  className = '',
}: {
  badge: Pick<Badge, 'id' | 'rango' | 'immagine'>;
  size?: number;
  className?: string;
}) {
  const src = badge.immagine ?? immagineBadge(badge.id);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
      aria-hidden="true"
    />
  );
}
