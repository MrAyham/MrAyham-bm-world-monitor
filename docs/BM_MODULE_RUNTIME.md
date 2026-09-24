# BM World Monitor Module Runtime

This document defines the BM-mounted runtime contract for the World Monitor fork.

## User-facing mount

BM AI OS presents World Monitor under:

```text
/modules/world/
```

BM Core conditionally proxies that path to the independently deployed World Monitor runtime when this server-only environment variable is present:

```text
BM_WORLD_MONITOR_URL=https://<world-monitor-runtime-origin>
```

## BM build configuration

Use the isolated BM Vite wrapper rather than editing upstream `vite.config.ts`:

```bash
npx vite build --config vite.bm.config.ts
```

For local development of the BM-mounted distribution:

```bash
npx vite --config vite.bm.config.ts
```

The wrapper sets Vite `base` to `/modules/world/` and injects the BM API namespace bootstrap before the normal World Monitor entrypoint.

## API namespace

World Monitor's own same-origin `/api/*` browser calls are rewritten to:

```text
/modules/world/api/*
```

BM Core then proxies those requests to the World Monitor runtime. This prevents collisions with BM-owned APIs.

## PWA / service worker requirement

World Monitor has PWA/service-worker behavior. The mounted BM distribution must prove that the generated service-worker scope and asset URLs stay under `/modules/world/` before merge. A worker that controls `/` would be considered a failed integration because it could interfere with the BM shell.

## AGPL requirement

This fork remains AGPL-3.0-only. The BM-mounted deployment must preserve notices and comply with the license's network-use source obligations for the modified World Monitor distribution.

## Preview verification gate

1. BM-specific build completes with `vite.bm.config.ts`.
2. Generated asset URLs resolve below `/modules/world/`.
3. PWA/service worker remains scoped below `/modules/world/`.
4. `/modules/world/api/*` reaches World Monitor APIs through the BM gateway.
5. Maps, feeds, panels, alerts, and attribution render correctly.
6. No World Monitor route shadows BM Core `/api/*` or CEO routes.
7. The distribution remains globally functional before Ontario/Windsor presets are enabled.
8. Production BM and upstream fork branches remain untouched until the mounted Preview is visually verified.
