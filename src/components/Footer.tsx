export default function Footer() {
  return (
    <footer className="mt-16 bg-asfalto text-cemento">
      <div className="mezzeria" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="font-hand text-2xl leading-snug text-segnale sm:text-3xl">
          Le strade migliori le conosce chi le guida.
        </p>
        <p className="mt-3 max-w-xl text-sm text-guardrail">
          Gli itinerari li propone la community e li teniamo aggiornati: una
          frana, dei lavori, una sagra che chiude il paese. Prima di partire
          controlla le condizioni, e guida sempre con la testa sulle spalle.
        </p>
        <p className="mt-6 text-xs text-guardrail/70">GiroSecco · Italia</p>
      </div>
    </footer>
  );
}
