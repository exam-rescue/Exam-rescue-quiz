import { getRequestContext } from '@cloudflare/next-on-pages';

export function getBinding() {
  try {
    // @ts-ignore - Cloudflare D1 binding injected at runtime
    return getRequestContext().env.DB as D1Database | undefined;
  } catch {
    return undefined;
  }
}
