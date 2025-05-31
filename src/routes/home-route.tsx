import type { Component } from "solid-js";
import { JoinForm } from "~/modules/lobby/components/join-form";

export const HomeRoute: Component = () => {
  return (
    <main>
      <JoinForm />
    </main>
  );
};
