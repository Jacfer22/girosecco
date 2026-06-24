/** Vetrina hub: rapporto 3,5 cm × 3 cm (7:6), ~2 mm di margine bianco per lato. */
export const VETRINA_RAPPORTO = 7 / 6;
export const VETRINA_LARGHEZZA = 840;
export const VETRINA_ALTEZZA = 720;
/** Margine bianco per lato rispetto al lato corto del contenuto (~2 mm su 3 cm). */
export const VETRINA_MARGINE_LATO = 2 / 30;

export interface BBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

function caricaImmagine(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Immagine non valida'));
    img.src = dataUrl;
  });
}

/** Trova il rettangolo della moto (pixel non bianchi / non trasparenti). */
export function trovaBBoxContenuto(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  sogliaBianco = 248,
): BBox | null {
  const { data } = ctx.getImageData(0, 0, width, height);
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let trovato = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 12) continue;
      if (r >= sogliaBianco && g >= sogliaBianco && b >= sogliaBianco) continue;
      trovato = true;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (!trovato || maxX <= minX || maxY <= minY) return null;
  return { minX, minY, maxX, maxY };
}

function espandiBBox(bbox: BBox, marginPx: number, width: number, height: number): BBox {
  return {
    minX: Math.max(0, bbox.minX - marginPx),
    minY: Math.max(0, bbox.minY - marginPx),
    maxX: Math.min(width - 1, bbox.maxX + marginPx),
    maxY: Math.min(height - 1, bbox.maxY + marginPx),
  };
}

/** Ritaglia la moto con margine bianco e la centra in un rettangolo 7:6. */
export async function preparaImmagineVetrina(
  sorgenteDataUrl: string,
  opzioni?: { nomeBase?: string },
): Promise<{ blob: Blob; file: File; anteprimaUrl: string }> {
  const img = await caricaImmagine(sorgenteDataUrl);
  const sorgente = document.createElement('canvas');
  sorgente.width = img.width;
  sorgente.height = img.height;
  const sCtx = sorgente.getContext('2d');
  if (!sCtx) throw new Error('Canvas non disponibile');

  sCtx.fillStyle = '#ffffff';
  sCtx.fillRect(0, 0, sorgente.width, sorgente.height);
  sCtx.drawImage(img, 0, 0);

  const bbox = trovaBBoxContenuto(sCtx, sorgente.width, sorgente.height);
  if (!bbox) {
    throw new Error('Moto non visibile. Ruota o avvicina la vista e riprova.');
  }

  const contentW = bbox.maxX - bbox.minX + 1;
  const contentH = bbox.maxY - bbox.minY + 1;
  const marginPx = Math.max(4, Math.round(Math.min(contentW, contentH) * VETRINA_MARGINE_LATO));
  const crop = espandiBBox(bbox, marginPx, sorgente.width, sorgente.height);
  const cropW = crop.maxX - crop.minX + 1;
  const cropH = crop.maxY - crop.minY + 1;

  const out = document.createElement('canvas');
  out.width = VETRINA_LARGHEZZA;
  out.height = VETRINA_ALTEZZA;
  const oCtx = out.getContext('2d');
  if (!oCtx) throw new Error('Canvas non disponibile');

  oCtx.fillStyle = '#ffffff';
  oCtx.fillRect(0, 0, out.width, out.height);

  const cropRatio = cropW / cropH;
  let drawW = out.width;
  let drawH = out.height;
  if (cropRatio > VETRINA_RAPPORTO) {
    drawH = out.width / cropRatio;
  } else {
    drawW = out.height * cropRatio;
  }
  const dx = (out.width - drawW) / 2;
  const dy = (out.height - drawH) / 2;

  oCtx.drawImage(
    sorgente,
    crop.minX,
    crop.minY,
    cropW,
    cropH,
    dx,
    dy,
    drawW,
    drawH,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    out.toBlob((b) => (b ? resolve(b) : reject(new Error('Esportazione JPEG fallita'))), 'image/jpeg', 0.93);
  });

  const nomeBase = opzioni?.nomeBase ?? 'motogarage-vetrina';
  const file = new File([blob], `${nomeBase}.jpg`, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  });

  return {
    blob,
    file,
    anteprimaUrl: URL.createObjectURL(blob),
  };
}

/** Composita WebGL su bianco prima del ritaglio. */
export function canvasSuBianco(canvas: HTMLCanvasElement): string {
  const out = document.createElement('canvas');
  out.width = canvas.width;
  out.height = canvas.height;
  const ctx = out.getContext('2d');
  if (!ctx) throw new Error('Canvas non disponibile');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, 0, 0);
  return out.toDataURL('image/png');
}

/** Attende un frame di render WebGL prima della cattura. */
export function attendiFrameRender(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}
