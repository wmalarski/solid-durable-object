import type { Component } from "solid-js";
import { useI18n } from "~/modules/shared/i18n";
import { FieldError } from "~/ui/field-error/field-error";
import {
  Fieldset,
  FieldsetLabel,
  FieldsetLegend,
} from "~/ui/fieldset/fieldset";
import { FormError } from "~/ui/form-error/form-error";
import { Input } from "~/ui/input/input";
import { randomHexColor } from "~/utils/colors";
import { type FormIssues, getInvalidStateProps } from "~/utils/forms";

type JoinFieldsProps = {
  pending?: boolean;
  issues?: FormIssues;
};

export const JoinFields: Component<JoinFieldsProps> = (props) => {
  const { t } = useI18n();

  const defaultPlayerColor = randomHexColor();

  return (
    <Fieldset>
      <FieldsetLegend>{t("lobby.join.title")}</FieldsetLegend>

      <FormError message={props.issues?.error} />

      <FieldsetLabel for="name">{t("lobby.join.name")}</FieldsetLabel>
      <Input
        disabled={props.pending}
        id="name"
        name="name"
        required={true}
        width="full"
        {...getInvalidStateProps({
          errorMessageId: "name-error",
          isInvalid: !!props.issues?.errors?.name,
        })}
      />
      <FieldError id="color-error" message={props.issues?.errors?.name} />

      <FieldsetLabel for="color">{t("lobby.join.color")}</FieldsetLabel>
      <Input
        disabled={props.pending}
        id="color"
        name="color"
        required={true}
        type="color"
        value={defaultPlayerColor}
        width="full"
        {...getInvalidStateProps({
          errorMessageId: "color-error",
          isInvalid: !!props.issues?.errors?.color,
        })}
      />
      <FieldError id="color-error" message={props.issues?.errors?.color} />
    </Fieldset>
  );
};
