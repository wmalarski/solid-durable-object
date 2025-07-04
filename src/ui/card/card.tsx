import {
  type Component,
  type ComponentProps,
  splitProps,
  type ValidComponent,
} from "solid-js";
import { Dynamic, type DynamicProps } from "solid-js/web";
import { cn } from "tailwind-variants";
import type { ComponentVariantProps } from "../utils/types";
import { cardActionsRecipe, cardRecipe, cardTitleRecipe } from "./card.recipe";

export type CardProps = ComponentVariantProps<"div", typeof cardRecipe>;

export const Card: Component<CardProps> = (props) => {
  const [split, rest] = splitProps(props, ["variant", "size", "color"]);

  return <div {...rest} class={cardRecipe({ class: props.class, ...split })} />;
};

export type CardTitleProps<T extends ValidComponent> = DynamicProps<T>;

export function CardTitle<T extends ValidComponent>(props: CardTitleProps<T>) {
  return (
    <Dynamic
      {...props}
      class={cardTitleRecipe({ class: props.class })}
      component={props.component}
    />
  );
}

export type CardBodyProps = ComponentProps<"div">;

export const CardBody: Component<CardBodyProps> = (props) => {
  return (
    <div {...props} class={cn("card-body", props.class)({ twMerge: true })} />
  );
};

export type CardActionsProps = ComponentVariantProps<
  "div",
  typeof cardActionsRecipe
>;

export const CardActions: Component<CardActionsProps> = (props) => {
  const [split, rest] = splitProps(props, ["justify"]);

  return (
    <div
      {...rest}
      class={cardActionsRecipe({ class: props.class, ...split })}
    />
  );
};
