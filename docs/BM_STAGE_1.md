# BM World Monitor — Stage 1

Stage 1 establishes a safe Branding Market distribution boundary without changing the upstream intelligence engine.

## Included

- BM branding for the fork's default `full` distribution metadata.
- BM distribution configuration in `src/config/bm-distribution.ts`.
- Environment hook `VITE_BM_SHELL_URL` for return/navigation integration with BM AI OS.
- Distribution policy documenting the AGPL/upstream boundary.

## Deliberately unchanged

- Upstream feeds and source catalog.
- Map engines and map layers.
- Panel engine and variant registry.
- API/MCP engine.
- Authentication/security implementation.
- Desktop one-binary variant model.

## Stage 2

Stage 2 should adapt the centralized visible dashboard brand/navigation surface and then verify a production build before any merge into this fork's `main` branch.
