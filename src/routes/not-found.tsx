import { Title } from "@solidjs/meta";
import type { Component } from "solid-js";

export const NotFound: Component = () => {
  return (
    <main>
      <Title>Not Found</Title>
      {/* <HttpStatusCode code={404} /> */}
      <h1>Page Not Found</h1>
      <p>
        Visit{" "}
        <a href="https://start.solidjs.com" rel="noopener" target="_blank">
          start.solidjs.com
        </a>{" "}
        to learn how to build SolidStart apps.
      </p>
    </main>
  );
};
