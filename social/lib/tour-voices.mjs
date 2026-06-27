/** Voci Edge TTS — una per tipo moto */
export const MASCOT_VOICES = {
  rosso: { voice: 'it-IT-DiegoNeural', rate: '+5%' },
  blu: { voice: 'it-IT-IsabellaNeural', rate: '-2%' },
  nero: { voice: 'it-IT-GiuseppeNeural', rate: '-10%' },
};

/** Dialoghi parlati — frasi brevi, complete, niente tagli */
export const SCENE_VOICE_LINES = {
  '01-landing': {
    mascot: 'rosso',
    text: 'Ciao! Sono Rosso. Ti faccio vedere MotoGarage mentre navighi nell\'app.',
  },
  '02-itinerari': {
    mascot: 'blu',
    text: 'Io sono Blu. Qui trovi itinerari verificati in tutta Italia. Tu metti il casco, noi la mappa.',
  },
  '03-naviga': {
    mascot: 'blu',
    text: 'Navigatore pensato per la moto. Prossima manovra chiara, anche in cuffia.',
  },
  '04-garage': {
    mascot: 'nero',
    text: 'Sono Nero. Nel garage crei l\'avatar tre D della tua moto e lo mostri agli amici.',
  },
  '05-traccia': {
    mascot: 'rosso',
    text: 'Con Traccia registri il giro col GPS. Alla fine hai la card pronta per i social.',
  },
  '06-community': {
    mascot: 'nero',
    text: 'In community condividi i giri, vedi la classifica e i profili degli altri biker.',
  },
  '07-cta': {
    mascot: 'blu',
    text: 'Registrati gratis su motogarage punto info. Ci vediamo in curva!',
  },
};
