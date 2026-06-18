// Badge progressivi in base ai km totali registrati col GPS.
// Idea: progresso personale (non classifiche, che scoraggiano i nuovi).

export interface Badge {
  id: string;
  nome: string;
  kmRichiesti: number;
  emoji: string;
}

// Le soglie, dalla più bassa alla più alta.
export const BADGES: Badge[] = [
  { id: 'avviato', nome: 'Motore acceso', kmRichiesti: 0, emoji: '🔑' },
  { id: 'primi100', nome: 'Primi 100', kmRichiesti: 100, emoji: '🏍️' },
  { id: 'mezzomila', nome: 'Mezzo migliaio', kmRichiesti: 500, emoji: '🛣️' },
  { id: 'mille', nome: 'Mille km', kmRichiesti: 1000, emoji: '⭐' },
  { id: 'cinquemila', nome: 'Viaggiatore', kmRichiesti: 5000, emoji: '🏔️' },
  { id: 'diecimila', nome: 'Leggenda', kmRichiesti: 10000, emoji: '👑' },
];

// Il badge attualmente raggiunto dato un totale di km.
export function badgeRaggiunto(kmTotali: number): Badge {
  let attuale = BADGES[0];
  for (const b of BADGES) {
    if (kmTotali >= b.kmRichiesti) attuale = b;
  }
  return attuale;
}

// Il prossimo badge da raggiungere (null se sono tutti presi).
export function prossimoBadge(kmTotali: number): Badge | null {
  for (const b of BADGES) {
    if (kmTotali < b.kmRichiesti) return b;
  }
  return null;
}

// Percentuale di avanzamento verso il prossimo badge (0-100).
export function avanzamento(kmTotali: number): number {
  const attuale = badgeRaggiunto(kmTotali);
  const prossimo = prossimoBadge(kmTotali);
  if (!prossimo) return 100;
  const base = attuale.kmRichiesti;
  const traguardo = prossimo.kmRichiesti;
  return Math.round(((kmTotali - base) / (traguardo - base)) * 100);
}
