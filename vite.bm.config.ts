import { defineConfig, mergeConfig, type ConfigEnv, type Plugin, type UserConfig, type UserConfigExport } from 'vite';
import upstreamConfig from './vite.config';

const BM_WORLD_BASE = '/modules/world/';

function bmBootstrapPlugin(): Plugin {
  return {
    name: 'bm-world-bootstrap',
    enforce: 'pre',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const entry = '<script type="module" src="/src/main.ts" nonce="wm-static-bootstrap"></script>';
        const bootstrap = '<script type="module" src="/src/bm-fetch-bootstrap.ts" nonce="wm-static-bootstrap"></script>';
        if (!html.includes(entry)) {
          throw new Error('[bm-world] main entry marker not found; upstream index.html changed');
        }
        return html.replace(entry, `${bootstrap}\n    ${entry}`);
      },
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
  const base = await resolveUpstreamConfig(env);
  return mergeConfig(base, {
    base: BM_WORLD_BASE,
    plugins: [bmBootstrapPlugin()],
    define: {
      __BM_WORLD_MODULE_BASE__: JSON.stringify(BM_WORLD_BASE),
    },
  });
});
