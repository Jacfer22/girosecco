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

  const updatePointer = useCallback((clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMouse({
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    });
  }, []);

  const onMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => updatePointer(event.clientX, event.clientY),
    [updatePointer],
  );

  const onTouchMove = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      const touch = event.touches[0];
      if (touch) updatePointer(touch.clientX, touch.clientY);
    },
    [updatePointer],
  );

  const bgSrc = variant === 'garage' ? '/cinematic/garage-digitale.png' : '/garage-tuning.webp';

  useEffect(() => {
    setImmagineOk(false);
    const img = new Image();
    img.onload = () => setImmagineOk(true);
    img.onerror = () => setImmagineOk(false);
    img.src = bgSrc;
  }, [bgSrc]);

  useEffect(() => {
    if (variant !== 'landing') return;
    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (ridotto) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = ref.current;
        if (!el) return;
        const y = Math.min(window.scrollY, el.offsetHeight);
        el.style.setProperty('--scroll-y', `${y * 0.22}px`);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [variant]);

  const px = (mouse.x - 0.5) * (variant === 'garage' ? 16 : 10);
  const py = (mouse.y - 0.5) * (variant === 'garage' ? 8 : 6);

  return (
    <div
      ref={ref}
      className={`tuning-garage ${variant === 'garage' ? 'tuning-garage-garage' : 'tuning-garage-landing'} ${className}`}
      onMouseMove={onMove}
      onTouchMove={onTouchMove}
      style={{
        ['--mx' as string]: String(mouse.x),
        ['--my' as string]: String(mouse.y),
        ['--px' as string]: `${px}px`,
        ['--py' as string]: `${py}px`,
      }}
    >
      <div
        className={`tuning-garage-bg ${immagineOk ? 'tuning-garage-bg-foto' : ''} ${variant === 'garage' ? 'tuning-garage-bg-cinematic' : ''}`}
        aria-hidden="true"
      />
      <div className="tuning-garage-overlay" aria-hidden="true" />
      <div className="tuning-garage-luci" aria-hidden="true">
        <span className="tuning-luce tuning-luce-1" />
        <span className="tuning-luce tuning-luce-2" />
        <span className="tuning-luce tuning-luce-3" />
      </div>
      <div className="tuning-garage-pavimento" aria-hidden="true" />
      {variant === 'landing' && (
        <>
          <div className="tuning-garage-legno-sx" aria-hidden="true" />
          <div className="tuning-garage-legno-dx" aria-hidden="true" />
        </>
      )}
      <div className="tuning-garage-pedana" aria-hidden="true" />
      {variant === 'garage' && <div className="tuning-garage-riflesso" aria-hidden="true" />}
      <div className="tuning-garage-grain" aria-hidden="true" />
      {children}
    </div>
  );
}
