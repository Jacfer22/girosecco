// Le 20 regioni italiane. Lo slug è usato nelle URL /itinerari/regione/[slug].
export interface Regione {
  slug: string;
  nome: string;
}

export const REGIONI: Regione[] = [
  { slug: 'abruzzo', nome: 'Abruzzo' },
  { slug: 'basilicata', nome: 'Basilicata' },
  { slug: 'calabria', nome: 'Calabria' },
  { slug: 'campania', nome: 'Campania' },
  { slug: 'emilia-romagna', nome: 'Emilia-Romagna' },
  { slug: 'friuli-venezia-giulia', nome: 'Friuli-Venezia Giulia' },
  { slug: 'lazio', nome: 'Lazio' },
  { slug: 'liguria', nome: 'Liguria' },
  { slug: 'lombardia', nome: 'Lombardia' },
  { slug: 'marche', nome: 'Marche' },
  { slug: 'molise', nome: 'Molise' },
  { slug: 'piemonte', nome: 'Piemonte' },
  { slug: 'puglia', nome: 'Puglia' },
  { slug: 'sardegna', nome: 'Sardegna' },
  { slug: 'sicilia', nome: 'Sicilia' },
  { slug: 'toscana', nome: 'Toscana' },
  { slug: 'trentino-alto-adige', nome: 'Trentino-Alto Adige' },
  { slug: 'umbria', nome: 'Umbria' },
  { slug: "valle-d-aosta", nome: "Valle d'Aosta" },
  { slug: 'veneto', nome: 'Veneto' },
];

export function nomeRegione(slug: string): string | null {
  return REGIONI.find((r) => r.slug === slug)?.nome ?? null;
}

export function regioneEsiste(slug: string): boolean {
  return REGIONI.some((r) => r.slug === slug);
}
