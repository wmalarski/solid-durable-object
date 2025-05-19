import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { Head } from "./modules/shared/head";
import { I18nContextProvider } from "./modules/shared/i18n";

export default function App() {
  return (
    <Router
      root={(props) => (
        <I18nContextProvider>
          <MetaProvider>
            <Head />
            <Suspense>{props.children}</Suspense>
          </MetaProvider>
        </I18nContextProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
