import { type Component, type ComponentProps, splitProps } from "solid-js";

import type { ComponentVariantProps } from "../utils/types";
import {
  avatarContentRecipe,
  avatarGroup,
  avatarRecipe,
} from "./avatar.recipe";

export type AvatarGroupProps = ComponentProps<"div">;

export const AvatarGroup: Component<AvatarGroupProps> = (props) => {
  return <div {...props} class={avatarGroup({ class: props.class })} />;
};

export type AvatarProps = ComponentVariantProps<"div", typeof avatarRecipe>;

export const Avatar: Component<AvatarProps> = (props) => {
  const [split, rest] = splitProps(props, ["placeholder", "presence"]);

  return (
    <div {...rest} class={avatarRecipe({ class: props.class, ...split })} />
  );
};

export type AvatarContentProps = ComponentVariantProps<
  "div",
  typeof avatarContentRecipe
>;

export const AvatarContent: Component<AvatarContentProps> = (props) => {
  const [split, rest] = splitProps(props, [
    "size",
    "variant",
    "placeholder",
    "ring",
  ]);

  return (
    <div
      {...rest}
      class={avatarContentRecipe({ class: props.class, ...split })}
    />
  );
};
