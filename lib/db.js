import { getCloudflareContext } from '@opennextjs/cloudflare';
import { DatabaseError } from './errors';

// D1 binding declared in wrangler.jsonc as `DB`.
export async function getDB() {
  const { env } = await getCloudflareContext();
  if (!env.DB) {
    throw new DatabaseError(
      'D1 binding "DB" is not configured. Check wrangler.jsonc and run `wrangler d1 create foodie-course-db`.'
    );
  }
  return env.DB;
}
