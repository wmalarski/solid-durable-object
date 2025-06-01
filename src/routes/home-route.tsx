import type { Component } from "solid-js";

import { JoinForm } from "~/modules/lobby/components/join-form";
import { FormLayout, PageFooter, PageTitle } from "~/modules/shared/layout";

export const HomeRoute: Component = () => {
  return (
    <FormLayout>
      <PageTitle />
      <JoinForm />
      <PageFooter />
    </FormLayout>
  );
};
