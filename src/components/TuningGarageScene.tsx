'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Variant = 'landing' | 'garage';

interface Props {
  variant?: Variant;
  children?: React.ReactNode;
  className?: string;
}

export default function TuningGarageScene({ variant = 'landing', children, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [immagineOk, setImmagineOk] = useState(false);

  const onMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMouse({
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    });
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImmagineOk(true);
    img.onerror = () => setImmagineOk(false);
    img.src = '/garage-tuning.webp';
  }, []);

  const px = (mouse.x - 0.5) * (variant === 'garage' ? 16 : 10);
  const py = (mouse.y - 0.5) * (variant === 'garage' ? 8 : 6);

  return (
    <div
      ref={ref}
      className={`tuning-garage ${variant === 'garage' ? 'tuning-garage-garage' : 'tuning-garage-landing'} ${className}`}
      onMouseMove={onMove}
      style={{
        ['--mx' as string]: String(mouse.x),
        ['--my' as string]: String(mouse.y),
        ['--px' as string]: `${px}px`,
        ['--py' as string]: `${py}px`,
      }}
    >
      <div className={`tuning-garage-bg ${immagineOk ? 'tuning-garage-bg-foto' : ''}`} aria-hidden="true" />
      <div className="tuning-garage-overlay" aria-hidden="true" />
      <div className="tuning-garage-luci" aria-hidden="true">
        <span className="tuning-luce tuning-luce-1" />
        <span className="tuning-luce tuning-luce-2" />
        <span className="tuning-luce tuning-luce-3" />
      </div>
      <div className="tuning-garage-pavimento" aria-hidden="true" />
      <div className="tuning-garage-legno-sx" aria-hidden="true" />
      <div className="tuning-garage-legno-dx" aria-hidden="true" />
      <div className="tuning-garage-pedana" aria-hidden="true" />
      {children}
    </div>
  );
}
