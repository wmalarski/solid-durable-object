import { tv } from "tailwind-variants";

export const formContainerRecipe = tv({
  base: "flex w-full flex-col gap-4",
  variants: {
    maxW: {
      md: "max-w-md",
    },
  },
});
