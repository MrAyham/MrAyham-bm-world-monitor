# BM AI OS Integration

This fork is the World Monitor module for BM AI OS.

- Upstream: https://github.com/koala73/worldmonitor
- License: AGPL-3.0-only
- BM route: /ceo/world
- Integration mode: independently deployed service/application
- BM responsibilities: navigation, authentication handoff, mission context, governance, service health
- Module responsibilities: world intelligence UI, maps, feeds, correlation, MCP/REST/SDK capabilities

## Rules

1. Do not copy the World Monitor core into the proprietary BM core.
2. Keep upstream attribution and AGPL obligations intact.
3. Keep upstream synchronization possible.
4. BM-specific changes should be isolated behind configuration, theme, presets, auth bridge, and gateway adapters where practical.
5. Do not label simulated, stale, estimated, or fallback data as live.

## Initial BM adaptation targets

- BM visual shell and navigation handoff
- Arabic/RTL validation
- Windsor / Ontario / Canada presets where supported
- BM mission-context bridge
- BM service-health endpoint/indicator
- Preserve upstream MCP and REST surfaces instead of recreating them
