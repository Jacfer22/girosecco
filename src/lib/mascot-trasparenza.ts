const cache = new Map<string, string>();

function pixelIsSfondo(r: number, g: number, b: number): boolean {
  return r + g + b < 28;
}

/** Flood-fill dallo sfondo nero ai bordi — mantiene il corpo scuro della moto */
export function ritagliaSfondoNeroMascot(src: string, maxPx = 180): Promise<string> {
  if (typeof window === 'undefined') return Promise.resolve(src);
  const cached = cache.get(src);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(src);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const d = imageData.data;
      const isBg = new Uint8Array(w * h);
      const queue: number[] = [];

      const seed = (x: number, y: number) => {
        if (x < 0 || y < 0 || x >= w || y >= h) return;
        const idx = y * w + x;
        if (isBg[idx]) return;
        const p = idx * 4;
        if (!pixelIsSfondo(d[p], d[p + 1], d[p + 2])) return;
        isBg[idx] = 1;
        queue.push(x, y);
      };

      for (let x = 0; x < w; x += 1) {
        seed(x, 0);
        seed(x, h - 1);
      }
      for (let y = 0; y < h; y += 1) {
        seed(0, y);
        seed(w - 1, y);
      }

      while (queue.length > 0) {
        const y = queue.pop()!;
        const x = queue.pop()!;
        seed(x - 1, y);
        seed(x + 1, y);
        seed(x, y - 1);
        seed(x, y + 1);
      }

      for (let i = 0; i < w * h; i += 1) {
        if (isBg[i]) d[i * 4 + 3] = 0;
      }

      ctx.putImageData(imageData, 0, 0);
      const url = canvas.toDataURL('image/png');
      cache.set(src, url);
      resolve(url);
    };
    img.onerror = () => reject(new Error(`Impossibile caricare mascotte: ${src}`));
    img.src = src;
  });
}

export function urlMascotCached(src: string): string | null {
  return cache.get(src) ?? null;
}
