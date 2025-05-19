import { type Component, splitProps } from "solid-js";
import type { ComponentVariantProps } from "../utils/types";
import { loadingRecipe } from "./loading.recipe";

export type LoadingProps = ComponentVariantProps<"span", typeof loadingRecipe>;

export const Loading: Component<LoadingProps> = (props) => {
  const [split, rest] = splitProps(props, ["size"]);

  return (
    <span {...rest} class={loadingRecipe({ class: props.class, ...split })} />
  );
};
