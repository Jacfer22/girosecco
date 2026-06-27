/** Mascotte sempre visibili nella scena — solo idle + ingresso morbido, niente uscita laterale. */
export function mascotReelHold(mascotKey, progress) {
  let scale = 1;
  let opacity = 1;
  let x = 0;

  if (progress < 0.14) {
    const t = progress / 0.14;
    const ease = 1 - (1 - t) ** 3;
    scale = 0.9 + ease * 0.1;
    opacity = ease;
    const from = mascotKey === 'blu' ? 55 : -55;
    x = from * (1 - ease);
  }

  const phase = progress * Math.PI * 4.5;
  const y = -Math.sin(phase) * 7;
  const rotate = Math.sin(phase * 0.55) * 2.2;

  return { x, y, rotate, scale, blur: 0, opacity };
}

/** Burst tra una scena e l'altra — sgasata / accelerazione */
export function mascotTransitionBurst(mascotKey, progress) {
  const ease = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
  const dir = mascotKey === 'blu' ? 1 : -1;
  const x = dir * progress * 420;
  const scale = 1 + ease * 0.18;
  const blur = ease * 5;
  const rotate = dir * ease * 8;
  const opacity = progress < 0.08 ? progress / 0.08 : progress > 0.92 ? (1 - progress) / 0.08 : 1;

  return { x, y: -ease * 12, rotate, scale, blur, opacity };
}
