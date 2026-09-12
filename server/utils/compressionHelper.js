import zlib from "zlib";
import sharp from "sharp";

/**
 * Check if a buffer is already gzipped by checking magic bytes (0x1f, 0x8b)
 */
export const isGzipped = (buffer) => {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length < 2) return false;
  return buffer[0] === 0x1f && buffer[1] === 0x8b;
};

/**
 * Compress binary buffer (PDF, documents, json) with Maximum Gzip Compression (Level 9)
 * Used before saving binary documents to MongoDB or disk.
 */
export const compressBuffer = (buffer) => {
  if (!buffer) return buffer;
  const inputBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  if (isGzipped(inputBuffer)) return inputBuffer;
  return zlib.gzipSync(inputBuffer, { level: 9 });
};

/**
 * Decompress gzipped binary buffer
 */
export const decompressBuffer = (buffer) => {
  if (!buffer) return buffer;
  const inputBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  if (!isGzipped(inputBuffer)) return inputBuffer;
  return zlib.gunzipSync(inputBuffer);
};

/**
 * Compress any image buffer to modern, high-efficiency WebP format
 * Automatically resizes if larger than maxWidth, strips metadata, and applies quality compression.
 */
export const compressImage = async (
  imageBuffer,
  { maxWidth = 1200, maxHeight = 1200, quality = 80 } = {}
) => {
  if (!imageBuffer) return imageBuffer;
  try {
    const pipeline = sharp(imageBuffer)
      .rotate() // auto-orient from EXIF
      .resize({
        width: maxWidth,
        height: maxHeight,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality,
        effort: 6, // maximum compression effort
      });

    return await pipeline.toBuffer();
  } catch (error) {
    console.error("Image compression error, falling back to original:", error.message);
    return imageBuffer;
  }
};

/**
 * Helper to format bytes to human-readable string
 */
export const formatBytes = (bytes, decimals = 1) => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
