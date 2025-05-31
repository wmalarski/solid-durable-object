import { MetaProvider } from "@solidjs/meta";
import { ErrorBoundary, Suspense } from "solid-js";
import "./app.css";
import { ErrorFallback } from "./modules/shared/error-fallback";
import { Head } from "./modules/shared/head";
import { I18nContextProvider } from "./modules/shared/i18n";
import HomePage from "./routes";

export default function App() {
  return (
    <I18nContextProvider>
      <MetaProvider>
        <Head />
        <ErrorBoundary fallback={ErrorFallback}>
          <Suspense>
            <HomePage />
          </Suspense>
        </ErrorBoundary>
      </MetaProvider>
    </I18nContextProvider>
  );
}
