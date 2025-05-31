import type { Component, ComponentProps } from "solid-js";
import { LinkButton } from "~/ui/button/button";
import { paths } from "~/utils/paths";

export const JoinForm: Component = () => {
  const onSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      Join
      <LinkButton href={paths.game("aa123")}>Room</LinkButton>
    </form>
  );
};
