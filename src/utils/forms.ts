import type * as v from "valibot";

export type FormIssues = {
  error?: string;
  errors?: Record<string, string>;
};

export const parseFormValidationError = (
  issues: v.BaseIssue<unknown>[],
): FormIssues => {
  return {
    errors: Object.fromEntries(
      issues.map((issue) => [
        issue.path?.map((item) => item.key).join(".") || "global",
        issue.message,
      ]),
    ),
  };
};

type GetInvalidStateProps = {
  errorMessageId: string;
  isInvalid: boolean;
};

export const getInvalidStateProps = ({
  errorMessageId,
  isInvalid,
}: GetInvalidStateProps) => {
  if (!isInvalid) {
    return {};
  }

  return {
    "aria-describedby": errorMessageId,
    "aria-invalid": true,
  };
};
