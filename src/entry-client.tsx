// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

// biome-ignore lint/style/noNonNullAssertion: required
mount(() => <StartClient />, document.getElementById("app")!);
