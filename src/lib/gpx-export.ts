import type { Punto } from '@/lib/geo';

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Esporta tracciato GPS come file GPX (download client-side). */
export function scaricaGpx(punti: Punto[], nome: string) {
  if (punti.length === 0) return;
  const titolo = escapeXml(nome.trim() || 'Giro MotoGarage');
  const trkpts = punti
    .map((p) => {
      const ele = typeof p.alt === 'number' && Number.isFinite(p.alt) ? `\n        <ele>${p.alt}</ele>` : '';
      return `      <trkpt lat="${p.lat}" lon="${p.lng}">${ele}\n      </trkpt>`;
    })
    .join('\n');

  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="MotoGarage" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>${titolo}</name></metadata>
  <trk><name>${titolo}</name><trkseg>
${trkpts}
  </trkseg></trk>
</gpx>`;

  const blob = new Blob([gpx], { type: 'application/gpx+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(nome.trim() || 'giro-motogarage').replace(/[^\w\-]+/g, '-').slice(0, 48)}.gpx`;
  a.click();
  URL.revokeObjectURL(url);
}
