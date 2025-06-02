import type * as v from "valibot";

export type FormIssues = {
  error?: string;
  errors?: Record<string, string>;
  success: false;
};

// biome-ignore lint/suspicious/noExplicitAny: required
export type FormSuccess<T = any> = {
  data: T;
  success: true;
};

// biome-ignore lint/suspicious/noExplicitAny: required
export type FormResult<T = any> = FormIssues | FormSuccess<T>;

// biome-ignore lint/suspicious/noExplicitAny: required
export const parseFormSuccessResult = <T = any>(data: T): FormSuccess<T> => {
  return { data, success: true };
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
    success: false,
  };
};

export const parseFormException = <T extends { message: string }>(
  error: T,
): FormIssues => {
  return { error: error.message, success: false };
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
