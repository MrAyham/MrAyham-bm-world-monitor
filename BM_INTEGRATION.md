# BM AI OS Integration

This fork is the World Monitor module for BM AI OS.

- Upstream: https://github.com/koala73/worldmonitor
- License: AGPL-3.0-only
- BM route: /ceo/world
- User-facing module mount: /modules/world/
- Integration mode: independently deployed service/application presented through the BM shell
- BM responsibilities: navigation, authentication handoff, mission context, governance, service health
- Module responsibilities: world intelligence UI, maps, feeds, correlation, MCP/REST/SDK capabilities

## Rules

1. Do not copy the World Monitor core into the proprietary BM core.
2. Keep upstream attribution and AGPL obligations intact, including network-use source obligations for modified deployments.
3. Keep upstream synchronization possible.
4. BM-specific changes should be isolated behind configuration, theme, presets, auth bridge, and gateway adapters where practical.
5. Do not label simulated, stale, estimated, or fallback data as live.
6. Do not merge the BM distribution until its mounted Preview is verified end to end.

## BM module mount

BM Core owns the user-facing path and conditionally proxies the specialist runtime when `BM_WORLD_MONITOR_URL` is configured:

```text
/modules/world/* -> <BM_WORLD_MONITOR_URL>/*
```

The fork uses `vite.bm.config.ts` as an isolated wrapper over upstream `vite.config.ts` and sets the Vite base to:

```text
/modules/world/
```

`src/bm-fetch-bootstrap.ts` namespaces World Monitor's own same-origin `/api/*` calls to:

```text
/modules/world/api/*
```

This prevents collisions with BM Core APIs while allowing the World Monitor runtime to retain its existing server/API surface behind the gateway.

## Initial BM adaptation targets

- BM visual shell and navigation handoff
- Arabic/RTL validation
- Windsor / Ontario / Canada presets where supported
- BM mission-context bridge
- BM service-health endpoint/indicator
- Preserve upstream MCP and REST surfaces instead of recreating them

## Verification gate

Do not merge until all of the following are verified on a Preview deployment:

1. The World Monitor runtime builds using `vite.bm.config.ts`.
2. `/modules/world/` loads through BM Core without broken JS/CSS/map assets.
3. World Monitor `/api/*` requests resolve through `/modules/world/api/*` and do not collide with BM Core routes.
4. The PWA/service-worker scope remains under `/modules/world/` and does not control the BM shell root.
5. Maps, panels, feeds, correlation surfaces, and attribution still work.
6. Ontario/Canada/Windsor presets are additive configuration, not replacements for upstream global behavior.
7. AGPL/source attribution remains visible and the modified deployment's source obligations are satisfied.
8. Production BM `main` remains unchanged until the mounted module is visually verified.
