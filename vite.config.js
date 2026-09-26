// BM integration branch only: Vite discovers .js before .ts, so the existing
// upstream build command (`vite build`) enters the isolated BM wrapper while
// `vite.bm.config.ts` imports the original upstream TypeScript config directly.
export { default } from './vite.bm.config.ts';
