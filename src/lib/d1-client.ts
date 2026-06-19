export function getBinding() {
  // @ts-ignore - Cloudflare D1 binding injected at runtime
  return globalThis.DB as D1Database | undefined;
}
