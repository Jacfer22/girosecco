import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/home-href';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const routes = ['', '/itinerari', '/community', '/community/classifica', '/giri', '/foto', '/pro', '/privacy', '/termini'];
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));
}
