'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  src: string;
  children?: ReactNode;
  className?: string;
  /** Più scuro in basso per testi / moto in primo piano */
  vignette?: 'hero' | 'garage' | 'section';
  minHeight?: string;
}

export default function CinematicScene({
  src,
  children,
  className = '',
  vignette = 'hero',
  minHeight = 'min(92dvh, 900px)',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  const updatePointer = useCallback((clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMouse({
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    });
  }, []);

  const px = (mouse.x - 0.5) * 14;
  const py = (mouse.y - 0.5) * 8;
  const [parallax, setParallax] = useState(true);

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setParallax(!coarse && !mobile && !ridotto);
  }, []);

  return (
    <div
      ref={ref}
      className={`cinematic-scene cinematic-scene-${vignette} ${className}`}
      style={{
        minHeight,
        ...(parallax
          ? {
              ['--mx' as string]: String(mouse.x),
              ['--my' as string]: String(mouse.y),
              ['--px' as string]: `${px}px`,
              ['--py' as string]: `${py}px`,
            }
          : {}),
      }}
      onMouseMove={parallax ? (e) => updatePointer(e.clientX, e.clientY) : undefined}
      onTouchMove={parallax ? (e) => {
        const t = e.touches[0];
        if (t) updatePointer(t.clientX, t.clientY);
      } : undefined}
    >
      <div
        className="cinematic-scene-bg cinematic-scene-bg-foto"
        style={{ backgroundImage: `url(${src})` }}
        aria-hidden="true"
      />
      <div className="cinematic-scene-overlay" aria-hidden="true" />
      <div className="cinematic-scene-grain" aria-hidden="true" />
      {children}
    </div>
  );
}
