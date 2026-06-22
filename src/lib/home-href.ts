/** URL canonico del sito (es. https://girosecco.vercel.app). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://girosecco.vercel.app';

/** Home: sempre landing root. */
export function homeHref(_loggato?: boolean): string {
  return '/';
}
