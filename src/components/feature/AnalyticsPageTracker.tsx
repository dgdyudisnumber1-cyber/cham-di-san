import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { initializeAnalytics, trackPageView } from '@/lib/analytics';
import { useAnalyticsConsent } from './AnalyticsConsent';

export default function AnalyticsPageTracker() {
  const location = useLocation();
  const consent = useAnalyticsConsent();
  const lastTrackedLocation = useRef<string | null>(null);

  useEffect(() => {
    if (consent !== 'granted' || lastTrackedLocation.current === location.key) return;
    // Restore GA4 on reload when the visitor previously granted consent.
    // A stored consent value alone does not recreate window.gtag.
    initializeAnalytics();
    lastTrackedLocation.current = location.key;
    trackPageView(location.pathname);
  }, [consent, location.key, location.pathname]);

  return null;
}
