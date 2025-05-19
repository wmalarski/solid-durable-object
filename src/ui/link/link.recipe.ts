import { tv } from "tailwind-variants";

export const linkRecipe = tv({
  base: "link",
  defaultVariants: {
    color: undefined,
    hover: undefined,
    size: undefined,
  },
  variants: {
    color: {
      accent: "link-accent",
      error: "link-error",
      info: "link-info",
      neutral: "link-neutral",
      primary: "link-primary",
      secondary: "link-secondary",
      success: "link-success",
      warning: "link-warning",
    },
    hover: {
      false: "",
      true: "link-hover",
    },
    size: {
      xs: "text-xs",
    },
  },
});
