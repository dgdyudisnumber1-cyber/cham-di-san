const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

type EventParameters = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;

export function isAnalyticsConfigured() {
  return Boolean(measurementId && /^G-[A-Z0-9]+$/i.test(measurementId));
}

export function initializeAnalytics() {
  if (!isAnalyticsConfigured() || initialized || typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? ((...args: unknown[]) => window.dataLayer?.push(args));
  window.gtag('js', new Date());
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  });
  window.gtag('consent', 'update', { analytics_storage: 'granted' });
  window.gtag('config', measurementId, { send_page_view: false, anonymize_ip: true });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId!)}`;
  document.head.appendChild(script);
  initialized = true;
}

export function trackEvent(name: string, parameters: EventParameters = {}) {
  if (!initialized || !window.gtag) return;
  window.gtag('event', name, parameters);
}

export function trackPageView(pathname: string) {
  if (!initialized || !measurementId) return;
  trackEvent('page_view', {
    page_location: `${window.location.origin}${pathname}`,
    page_path: pathname,
    page_title: document.title,
  });
}
