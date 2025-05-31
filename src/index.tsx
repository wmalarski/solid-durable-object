/* @refresh reload */
import { render } from "solid-js/web";
import App from "./app";
import "./app.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Wrapper div not found");
}

render(() => <App />, root);
