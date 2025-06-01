import { MetaProvider } from "@solidjs/meta";
import { Route, Router } from "@solidjs/router";
import { ErrorBoundary, Suspense } from "solid-js";
import { ErrorFallback } from "./modules/shared/error-fallback";
import { Head } from "./modules/shared/head";
import { HonoClientProvider } from "./modules/shared/hono-client";
import { I18nContextProvider } from "./modules/shared/i18n";
import { BoardRoute } from "./routes/board-route";
import { HomeRoute } from "./routes/home-route";
import { NotFound } from "./routes/not-found";

export default function App() {
  return (
    <HonoClientProvider>
      <I18nContextProvider>
        <MetaProvider>
          <Head />
          <ErrorBoundary fallback={ErrorFallback}>
            <Suspense>
              <Router>
                <Route component={HomeRoute} path="/" />
                <Route component={BoardRoute} path="/game/:gameId" />
                <Route component={NotFound} path="*404" />
              </Router>
            </Suspense>
          </ErrorBoundary>
        </MetaProvider>
      </I18nContextProvider>
    </HonoClientProvider>
  );
}
