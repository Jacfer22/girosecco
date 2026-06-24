// Badge progressivi in base ai km totali registrati col GPS.

export interface Badge {
  id: string;
  nome: string;
  kmRichiesti: number;
  emoji: string;
}

export const BADGES: Badge[] = [
  { id: 'novellino', nome: 'Novellino', kmRichiesti: 0, emoji: '🔑' },
  { id: 'strada-aperta', nome: 'Strada aperta', kmRichiesti: 100, emoji: '🏍️' },
  { id: 're-curve', nome: 'Re delle curve', kmRichiesti: 500, emoji: '🛣️' },
  { id: 'guerriero-passi', nome: 'Guerriero dei passi', kmRichiesti: 1000, emoji: '⭐' },
  { id: 're-asfalto', nome: 'Re dell\'asfalto', kmRichiesti: 2500, emoji: '🏔️' },
  { id: 'leggenda-motori', nome: 'Leggenda dei motori', kmRichiesti: 5000, emoji: '👑' },
  { id: 'divinita-strada', nome: 'Divinità della strada', kmRichiesti: 10000, emoji: '⚡' },
];

export function badgeRaggiunto(kmTotali: number): Badge {
  let attuale = BADGES[0];
  for (const b of BADGES) {
    if (kmTotali >= b.kmRichiesti) attuale = b;
  }
  return attuale;
}

export function prossimoBadge(kmTotali: number): Badge | null {
  for (const b of BADGES) {
    if (kmTotali < b.kmRichiesti) return b;
  }
  return null;
}

export function avanzamento(kmTotali: number): number {
  const attuale = badgeRaggiunto(kmTotali);
  const prossimo = prossimoBadge(kmTotali);
  if (!prossimo) return 100;
  const base = attuale.kmRichiesti;
  const traguardo = prossimo.kmRichiesti;
  return Math.round(((kmTotali - base) / (traguardo - base)) * 100);
}
