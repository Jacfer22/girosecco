export default function Footer() {
  return (
    <footer className="mt-16 bg-asfalto text-cemento">
      <div className="mezzeria" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="font-hand text-2xl leading-snug text-segnale sm:text-3xl">
          Questi giri li abbiamo fatti davvero, in sella — non copiati da un
          forum.
        </p>
        <p className="mt-3 max-w-xl text-sm text-guardrail">
          Le strade cambiano: una frana, dei lavori, una sagra che chiude il
          paese. Prima di partire dai un’occhiata alle condizioni, e guida
          sempre con la testa sulle spalle.
        </p>
        <p className="mt-6 text-xs text-guardrail/70">
          GiroSecco · Lazio
        </p>
      </div>
    </footer>
  );
}
