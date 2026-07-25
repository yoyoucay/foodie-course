import { getCloudflareContext } from '@opennextjs/cloudflare';
import { StorageError } from './errors';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

// R2 binding declared in wrangler.jsonc as `MEALS_BUCKET`.
export async function getBucket() {
  const { env } = await getCloudflareContext();
  if (!env.MEALS_BUCKET) {
    throw new StorageError(
      'R2 binding "MEALS_BUCKET" is not configured. Check wrangler.jsonc and run `wrangler r2 bucket create foodie-course-images`.'
    );
  }
  return env.MEALS_BUCKET;
}

export function isAllowedImageType(type) {
  return ALLOWED_IMAGE_TYPES.includes(type);
}

export function isImageTooLarge(size) {
  return size > MAX_IMAGE_BYTES;
}

export const MAX_IMAGE_SIZE_MB = MAX_IMAGE_BYTES / (1024 * 1024);

export async function uploadImage(file, key) {
  const bucket = await getBucket();
  const buffer = await file.arrayBuffer();

  try {
    await bucket.put(key, buffer, {
      httpMetadata: { contentType: file.type },
    });
  } catch (cause) {
    throw new StorageError(`Failed to upload image "${key}" to R2`, cause);
  }

  return key;
}

export function getImageUrl(key) {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (!base) {
    // Don't hard-fail rendering over a missing env var; fall back to a
    // local placeholder and make the misconfiguration visible in logs.
    console.warn('NEXT_PUBLIC_R2_PUBLIC_URL is not set; serving placeholder images.');
    return '/placeholder-meal.svg';
  }
  return `${base.replace(/\/$/, '')}/${key}`;
}
