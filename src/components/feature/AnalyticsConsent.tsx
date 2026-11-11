import { createContext, useContext, useState, type ReactNode } from 'react';
import { initializeAnalytics, isAnalyticsConfigured } from '@/lib/analytics';

type Consent = 'granted' | 'denied' | null;

const storageKey = 'cham-di-san.analytics-consent';
const AnalyticsConsentContext = createContext<Consent>(null);
const AnalyticsPreferencesContext = createContext<() => void>(() => {});

function readConsent(): Consent {
  const saved = localStorage.getItem(storageKey);
  return saved === 'granted' || saved === 'denied' ? saved : null;
}

export function AnalyticsConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<Consent>(readConsent);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const choose = (value: Exclude<Consent, null>) => {
    const shouldUnloadAnalytics = consent === 'granted' && value === 'denied';
    localStorage.setItem(storageKey, value);
    if (value === 'granted') initializeAnalytics();
    setConsent(value);
    setPreferencesOpen(false);
    // Remove an already loaded Google tag if permission is withdrawn.
    if (shouldUnloadAnalytics) window.location.reload();
  };

  return (
    <AnalyticsPreferencesContext.Provider value={() => setPreferencesOpen(true)}>
      <AnalyticsConsentContext.Provider value={consent}>
        {children}
        {(consent === null || preferencesOpen) && isAnalyticsConfigured() && (
        <section
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-2xl rounded-2xl border border-background-200 bg-background-50 p-4 shadow-xl md:p-5"
          role="dialog"
          aria-label="Lựa chọn phân tích website"
        >
          <p className="font-heading text-base font-semibold text-foreground-950">Quyền riêng tư &amp; phân tích</p>
          {preferencesOpen && (
            <button type="button" onClick={() => setPreferencesOpen(false)}
              className="absolute right-4 top-3 text-sm text-foreground-700 underline hover:text-foreground-950">
              Đóng
            </button>
          )}
          <p className="mt-1 text-sm leading-relaxed text-foreground-700">
            Chúng tôi chỉ bật Google Analytics sau khi bạn đồng ý để hiểu cách sử dụng website. Dữ liệu phân tích không bao gồm email, mật khẩu, số điện thoại hay nội dung bạn đóng góp.
          </p>
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => choose('denied')} className="rounded-md border border-background-300 px-4 py-2 text-sm font-medium text-foreground-700 hover:bg-background-100">
              Không đồng ý
            </button>
            <button type="button" onClick={() => choose('granted')} className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-background-50 hover:bg-primary-600">
              Đồng ý phân tích
            </button>
          </div>
        </section>
        )}
      </AnalyticsConsentContext.Provider>
    </AnalyticsPreferencesContext.Provider>
  );
}

export function useAnalyticsConsent() {
  return useContext(AnalyticsConsentContext);
}

export function useOpenAnalyticsPreferences() {
  return useContext(AnalyticsPreferencesContext);
}
