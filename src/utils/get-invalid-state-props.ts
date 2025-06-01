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
