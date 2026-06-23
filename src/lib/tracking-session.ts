const KEY = 'motogarage_tracking_attivo';

export function segnaTrackingAttivo(attivo: boolean) {
  if (typeof window === 'undefined') return;
  try {
    if (attivo) localStorage.setItem(KEY, '1');
    else localStorage.removeItem(KEY);
  } catch {
    // ignora
  }
}

export function isTrackingAttivo(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}
