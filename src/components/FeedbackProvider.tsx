'use client';

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type TipoToast = 'ok' | 'errore' | 'info';

interface ToastItem {
  id: number;
  messaggio: string;
  tipo: TipoToast;
}

export interface OpzioniConferma {
  titolo: string;
  messaggio: string;
  conferma?: string;
  annulla?: string;
  pericolo?: boolean;
}

interface FeedbackContextValue {
  toast: (messaggio: string, tipo?: TipoToast) => void;
  conferma: (opzioni: OpzioniConferma) => Promise<boolean>;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback richiede FeedbackProvider');
  return ctx;
}

export default function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confermaAperta, setConfermaAperta] = useState<OpzioniConferma | null>(null);
  const risolviRef = useRef<((valore: boolean) => void) | null>(null);

  const toast = useCallback((messaggio: string, tipo: TipoToast = 'ok') => {
    const id = Date.now() + Math.random();
    setToasts((attuali) => [...attuali, { id, messaggio, tipo }]);
    window.setTimeout(() => {
      setToasts((attuali) => attuali.filter((t) => t.id !== id));
    }, 3400);
  }, []);

  const conferma = useCallback((opzioni: OpzioniConferma) => {
    return new Promise<boolean>((resolve) => {
      risolviRef.current = resolve;
      setConfermaAperta(opzioni);
    });
  }, []);

  function chiudiConferma(esito: boolean) {
    risolviRef.current?.(esito);
    risolviRef.current = null;
    setConfermaAperta(null);
  }

  return (
    <FeedbackContext.Provider value={{ toast, conferma }}>
      {children}

      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((item) => (
          <div key={item.id} className={`toast-item toast-item-${item.tipo}`} role="status">
            {item.messaggio}
          </div>
        ))}
      </div>

      {confermaAperta && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="conferma-titolo"
        >
          <div className="w-full max-w-md rounded-app-lg border border-white/10 bg-asfalto p-6 text-cemento shadow-app-lg">
            <h2 id="conferma-titolo" className="font-display text-2xl font-black uppercase leading-tight tracking-tight text-white">
              {confermaAperta.titolo}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-cemento/75">{confermaAperta.messaggio}</p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => chiudiConferma(false)}
                className="tap rounded-app border border-white/15 px-5 py-3 font-mono text-xs font-bold uppercase text-cemento/70 hover:border-white/30"
              >
                {confermaAperta.annulla ?? 'Annulla'}
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => chiudiConferma(true)}
                className={`tap rounded-app px-5 py-3 font-mono text-xs font-bold uppercase text-white ${
                  confermaAperta.pericolo ? 'bg-red-700 hover:bg-red-600' : 'bg-brand hover:bg-brand-chiaro shadow-brand'
                }`}
              >
                {confermaAperta.conferma ?? 'Conferma'}
              </button>
            </div>
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}
