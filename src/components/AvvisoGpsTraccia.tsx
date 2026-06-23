'use client';

import { useState } from 'react';

const CHIAVE = 'motogarage_gps_tip_dismiss';

export default function AvvisoGpsTraccia() {
  const [visibile, setVisibile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem(CHIAVE);
  });

  if (!visibile) return null;

  return (
    <div className="mt-4 rounded-app border border-brand/25 bg-brand/[0.06] p-4 text-sm text-cemento/85">
      <p className="font-mono text-[10px] font-bold uppercase tracking-wide text-brand">Consiglio in sella</p>
      <p className="mt-2 leading-relaxed">
        Tieni MotoGarage in primo piano durante il giro. Su iPhone: aggiungi l&apos;app alla Home e concedi
        il permesso GPS &quot;Sempre&quot; o &quot;Durante l&apos;uso&quot;.
      </p>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem(CHIAVE, '1');
          setVisibile(false);
        }}
        className="tap mt-3 font-mono text-[10px] uppercase text-brand underline"
      >
        Ho capito
      </button>
    </div>
  );
}
