const BM_WORLD_BASE = '/modules/world/';

function rewriteBmWorldApiPath(pathname: string): string {
  if (!pathname.startsWith('/api/')) return pathname;
  return `${BM_WORLD_BASE}api/${pathname.slice('/api/'.length)}`;
}

function sameOrigin(url: URL): boolean {
  return typeof globalThis.location !== 'undefined' && url.origin === globalThis.location.origin;
}

function rewriteInput(input: RequestInfo | URL): RequestInfo | URL {
  if (typeof input === 'string') {
    if (!input.startsWith('/api/')) return input;
    return rewriteBmWorldApiPath(input);
  }

  if (input instanceof URL) {
    if (!sameOrigin(input) || !input.pathname.startsWith('/api/')) return input;
    const next = new URL(input.toString());
    next.pathname = rewriteBmWorldApiPath(next.pathname);
    return next;
  }

  if (typeof Request !== 'undefined' && input instanceof Request) {
    const url = new URL(input.url);
    if (!sameOrigin(url) || !url.pathname.startsWith('/api/')) return input;
    url.pathname = rewriteBmWorldApiPath(url.pathname);
    return new Request(url, input);
  }

  return input;
}

/**
 * Namespace World Monitor provider/API traffic behind the BM shell while the
 * module is mounted at /modules/world/. This keeps BM Core routes independent
 * and lets World Monitor retain its own API implementation behind the gateway.
 */
export function installBmWorldFetchNamespace(): void {
  if (typeof globalThis.fetch !== 'function') return;
  if ((globalThis as typeof globalThis & { __bmWorldFetchNamespaced?: boolean }).__bmWorldFetchNamespaced) return;

  const originalFetch = globalThis.fetch.bind(globalThis);
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) =>
    originalFetch(rewriteInput(input), init)) as typeof globalThis.fetch;

  Object.defineProperty(globalThis, '__bmWorldFetchNamespaced', {
    value: true,
    configurable: false,
    enumerable: false,
    writable: false,
  });
}

installBmWorldFetchNamespace();

export { rewriteBmWorldApiPath };
