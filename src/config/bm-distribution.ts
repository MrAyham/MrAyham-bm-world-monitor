export const BM_DISTRIBUTION = {
  enabled: true,
  productName: 'BM World Monitor',
  shellName: 'BM AI OS',
  returnLabel: 'BM AI OS',
  returnUrl: import.meta.env.VITE_BM_SHELL_URL || '',
  integrationVersion: 1,
} as const;

export function isBmShellReturnConfigured(): boolean {
  return BM_DISTRIBUTION.returnUrl.trim().length > 0;
}
