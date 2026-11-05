import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface Size {
  readonly width: number;
  readonly height: number;
}

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const pngSize = (b: Buffer): Size => ({ width: b.readUInt32BE(16), height: b.readUInt32BE(20) });

const jpegSize = (b: Buffer): Size | null => {
  let offset = 2;
  while (offset + 9 < b.length) {
    if (b[offset] !== 0xff) return null;
    const marker = b[offset + 1] ?? 0;
    const length = b.readUInt16BE(offset + 2);
    // SOF0–SOF15, exceto DHT (C4), JPG (C8) e DAC (CC).
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { width: b.readUInt16BE(offset + 7), height: b.readUInt16BE(offset + 5) };
    }
    offset += 2 + length;
  }
  return null;
};

const webpSize = (b: Buffer): Size | null => {
  const chunk = b.toString('ascii', 12, 16);
  if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  if (chunk === 'VP8L') {
    const bits = b.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
  }
  if (chunk === 'VP8X') return { width: b.readUIntLE(24, 3) + 1, height: b.readUIntLE(27, 3) + 1 };
  return null;
};

/** Lê largura e altura do cabeçalho de PNG, JPEG ou WebP. */
export const imageSize = (assetsDir: string, name: string): Size => {
  const b = readFileSync(join(assetsDir, name));
  const size = b.subarray(0, 8).equals(PNG_SIGNATURE)
    ? pngSize(b)
    : b[0] === 0xff && b[1] === 0xd8
      ? jpegSize(b)
      : b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP'
        ? webpSize(b)
        : null;
  if (!size) throw new Error(`Formato de imagem não reconhecido: ${name}`);
  return size;
};
