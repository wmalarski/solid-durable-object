import { Button } from "~/ui/button/button";

export default function Home() {
  return (
    <main>
      <h1>Hello world!</h1>
      <p>
        Visit{" "}
        <a href="https://start.solidjs.com" rel="noopener" target="_blank">
          start.solidjs.com
        </a>{" "}
        to learn how to build SolidStart apps.
      </p>
      <Button>Hello</Button>
    </main>
  );
}
