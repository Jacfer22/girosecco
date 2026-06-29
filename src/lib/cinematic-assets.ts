export const CINEMATIC = {
  traccia: '/cinematic/traccia-giro.png',
  navigazione: '/cinematic/navigazione-gps.png',
  card: '/cinematic/card-giro.png',
  garage: '/cinematic/garage-digitale.png',
  garageAmbient: '/garage-ambient.webp',
} as const;

export type CinematicAsset = (typeof CINEMATIC)[keyof typeof CINEMATIC];
