# Upstream-safe integration notes

- Keep `main` close to upstream where practical.
- BM-specific work lives on `bm/integration` until verified.
- Prefer small additive files and narrow metadata/config changes over broad source rewrites.
- Preserve upstream license, attribution, and source-availability obligations.
- Avoid introducing a `bm` site variant until all upstream variant-dependent tests/assets/download paths are deliberately extended.
