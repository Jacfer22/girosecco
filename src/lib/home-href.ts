import { BRAND_URL_DISPLAY } from '@/lib/brand-display';

/** URL canonico del sito (env Vercel o motogarage.info). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? BRAND_URL_DISPLAY;

/** Home: sempre landing root. */
export function homeHref(_loggato?: boolean): string {
  return '/';
}
