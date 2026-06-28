'use client';

import { useCallback, useEffect, useState } from 'react';
import { leggiMascotGps, salvaMascotGps, type IdMascotGps } from '@/lib/mascot-gps';

export function useMascotGpsId() {
  const [id, setId] = useState<IdMascotGps>('rosso');

  useEffect(() => {
    setId(leggiMascotGps());
  }, []);

  const imposta = useCallback((next: IdMascotGps) => {
    setId(next);
    salvaMascotGps(next);
  }, []);

  return { mascotId: id, impostaMascot: imposta };
}
