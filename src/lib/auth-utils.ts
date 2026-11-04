const AUTH_ROUTES = [
  '/auth',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/callback',
];

export function validateOrdinaryPostAuthNext(next: string | null | undefined): string {
  if (!next) return '/';
  if (!next.startsWith('/') || next.startsWith('//')) return '/';
  if (AUTH_ROUTES.some((r) => next === r || next.startsWith(`${r}/`))) return '/';
  return next;
}

export function getAuthRedirectUrl(): string {
  const base = (typeof __BASE_PATH__ !== 'undefined' ? __BASE_PATH__ : '').replace(/\/+$/, '');
  return `${window.location.origin}${base}/auth/callback`;
}