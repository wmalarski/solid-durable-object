import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { ErrorBoundary, Suspense } from "solid-js";
import { ErrorFallback } from "./modules/shared/error-fallback";
import { Head } from "./modules/shared/head";
import { HonoClientProvider } from "./modules/shared/hono-client";
import { I18nContextProvider } from "./modules/shared/i18n";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <HonoClientProvider>
          <I18nContextProvider>
            <MetaProvider>
              <Head />
              <ErrorBoundary fallback={ErrorFallback}>
                <Suspense>{props.children}</Suspense>
              </ErrorBoundary>
            </MetaProvider>
          </I18nContextProvider>
        </HonoClientProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
