import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { AuthProvider } from "./lib/auth";
import SocialDock from "./components/feature/SocialDock";
import AnalyticsPageTracker from "./components/feature/AnalyticsPageTracker";
import { AnalyticsConsentProvider } from "./components/feature/AnalyticsConsent";


function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <BrowserRouter basename={__BASE_PATH__}>
          <AnalyticsConsentProvider>
            <AppRoutes />
            <AnalyticsPageTracker />
            <SocialDock />
          </AnalyticsConsentProvider>
        </BrowserRouter>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;
