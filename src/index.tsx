/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./app";

const root = document.getElementById("root");

// biome-ignore lint/style/noNonNullAssertion: this how it works
render(() => <App />, root!);
