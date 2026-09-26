# BM World Monitor Distribution

This fork preserves the upstream World Monitor engine and adapts the default `full` distribution for use inside BM AI OS.

## Upstream

- Canonical upstream: `koala73/worldmonitor`
- License: AGPL-3.0-only
- Upstream engine and attribution must remain intact.

## BM policy

- Do not recreate World Monitor features inside BM AI OS.
- Do not globally rename upstream source identifiers.
- Keep the underlying `full` engine compatible with upstream updates.
- Apply BM branding at distribution/integration boundaries rather than modifying unrelated engine internals.
- BM AI OS remains the navigation, authentication, governance, mission, and orchestration shell.

## Current adaptation

The fork's default `full` metadata is branded as **BM World Monitor** while retaining the upstream `full` variant engine.

This intentionally avoids adding a new `bm` value to `SITE_VARIANTS` at this stage because upstream ties that registry to desktop downloads, variant assets, and tests.

## Next integration points

1. Identify the centralized visible dashboard brand surface and adapt it without global search/replace.
2. Add a BM return/navigation bridge that can be configured by deployment environment.
3. Add BM session/context handoff without weakening World Monitor security boundaries.
4. Keep all data-source status labels truthful (live, delayed, snapshot, simulated, unavailable).
5. Verify build and dashboard boot before proposing merge to this fork's `main` branch.
