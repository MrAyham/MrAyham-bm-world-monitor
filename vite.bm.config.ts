import {
  defineConfig,
  mergeConfig,
  type ConfigEnv,
  type Plugin,
  type UserConfig,
  type UserConfigExport,
} from 'vite';
import upstreamConfig from './vite.config.ts';

const BM_WORLD_BASE = '/modules/world/';
const PWA_PLUGIN_PREFIX = 'vite-plugin-pwa';
const SW_REGISTRATION_GATE =
  "if (!('__TAURI_INTERNALS__' in window) && !('__TAURI__' in window) && swContainer) {";

function stripPwaPlugins(plugins: UserConfig['plugins'] = []): UserConfig['plugins'] {
  const strip = (entry: unknown): unknown => {
    if (Array.isArray(entry)) {
      return entry.map(strip).filter((value) => value != null);
    }
    if (entry && typeof entry === 'object') {
      const candidate = entry as { name?: unknown };
      if (
        typeof candidate.name === 'string' &&
        candidate.name.startsWith(PWA_PLUGIN_PREFIX)
      ) {
        return null;
      }
    }
    return entry;
  };

  return plugins.map(strip).filter((value) => value != null) as UserConfig['plugins'];
}

function bmBootstrapPlugin(): Plugin {
  let serviceWorkerGatePatched = false;

  return {
    name: 'bm-world-bootstrap',
    enforce: 'pre',
    transform(code, id) {
      const cleanId = String(id || '').split('?')[0].replace(/\\/g, '/');
      if (!cleanId.endsWith('/src/main.ts')) return null;
      if (!code.includes(SW_REGISTRATION_GATE)) {
        throw new Error(
          '[bm-world] service-worker registration gate not found; upstream main.ts changed',
        );
      }
      serviceWorkerGatePatched = true;
      return {
        code: code.replace(
          SW_REGISTRATION_GATE,
          `if (false && ${SW_REGISTRATION_GATE.slice(4)}`,
        ),
        map: null,
      };
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const entry =
          '<script type="module" src="/src/main.ts" nonce="wm-static-bootstrap"></script>';
        const bootstrap =
          '<script type="module" src="/src/bm-fetch-bootstrap.ts" nonce="wm-static-bootstrap"></script>';
        if (!html.includes(entry)) {
          throw new Error(
            '[bm-world] main entry marker not found; upstream index.html changed',
          );
        }
        return html.replace(entry, `${bootstrap}\n    ${entry}`);
      },
    },
    configResolved(config) {
      const leakedPwaPlugins = config.plugins
        .map((plugin) => plugin.name)
        .filter((name) => name.startsWith(PWA_PLUGIN_PREFIX));
      if (leakedPwaPlugins.length) {
        throw new Error(
          `[bm-world] PWA plugin leaked into mounted build: ${leakedPwaPlugins.join(', ')}`,
        );
      }
    },
    buildEnd(error) {
      if (!error && !serviceWorkerGatePatched) {
        throw new Error(
          '[bm-world] service-worker registration guard was not applied to src/main.ts',
        );
      }
    },
  };
}

async function resolveUpstreamConfig(env: ConfigEnv): Promise<UserConfig> {
  const exported = upstreamConfig as UserConfigExport;
  if (typeof exported === 'function') {
    return await exported(env);
  }
  return await exported;
}

export default defineConfig(async (env) => {
  const upstream = await resolveUpstreamConfig(env);
  const base: UserConfig = {
    ...upstream,
    plugins: stripPwaPlugins(upstream.plugins),
  };

  return mergeConfig(base, {
    base: BM_WORLD_BASE,
    plugins: [bmBootstrapPlugin()],
    define: {
      __BM_WORLD_MODULE_BASE__: JSON.stringify(BM_WORLD_BASE),
    },
  });
});
