import { type Action, useAction } from "@solidjs/router";
import type { ComponentProps } from "solid-js";
import type { FormResult } from "./forms";

type UseActionOnSubmitArgs = {
  onSuccess: () => void;
  resetOnSuccess?: boolean;
  action: Action<[form: FormData], FormResult, [form: FormData]>;
};

export const useActionOnSubmit = (args: UseActionOnSubmitArgs) => {
  const action = useAction(args.action);

  const onSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const result = await action(formData);

    if (!result?.success) {
      return;
    }

    args.onSuccess();

    if (args.resetOnSuccess) {
      event.currentTarget.reset();
    }
  };

  return onSubmit;
};
