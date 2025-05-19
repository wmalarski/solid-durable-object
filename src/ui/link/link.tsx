import { type Component, splitProps } from "solid-js";
import type { ComponentVariantProps } from "../utils/types";
import { linkRecipe } from "./link.recipe";

export type LinkProps = ComponentVariantProps<"a", typeof linkRecipe>;

export const Link: Component<LinkProps> = (props) => {
  const [split, rest] = splitProps(props, ["color", "hover", "size"]);

  return <a {...rest} class={linkRecipe({ class: props.class, ...split })} />;
};
