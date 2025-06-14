import { tv } from "tailwind-variants";

export const avatarRecipe = tv({
  base: "avatar",
  defaultVariants: {},
  variants: {
    placeholder: {
      true: "placeholder",
    },
    presence: {
      offline: "offline",
      online: "online",
    },
  },
});

export const avatarGroup = tv({
  base: "avatar-group -space-x-6",
});

export const avatarContentRecipe = tv({
  defaultVariants: {
    size: "md",
    variant: "full",
  },
  variants: {
    placeholder: {
      true: "bg-neutral-focus text-neutral-content",
    },
    ring: {
      accent: "ring ring-accent ring-offset-base-100 ring-offset-2",
      error: "ring ring-error ring-offset-base-100 ring-offset-2",
      primary: "ring ring-primary ring-offset-base-100 ring-offset-2",
      secondary: "ring ring-secondary ring-offset-base-100 ring-offset-2",
      success: "ring ring-success ring-offset-base-100 ring-offset-2",
      warning: "ring ring-warning ring-offset-base-100 ring-offset-2",
    },
    size: {
      lg: "w-32",
      md: "w-20",
      sm: "w-16",
      xs: "w-8",
    },
    variant: {
      full: "rounded-full",
      rounded: "rounded",
      xl: "rounded-xl",
    },
  },
});
