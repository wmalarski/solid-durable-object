import { JoinForm } from "~/modules/lobby/components/join-form";
import { FormLayout, PageFooter, PageTitle } from "~/modules/shared/layout";

export default function HomeRoute() {
  return (
    <FormLayout>
      <PageTitle />
      <JoinForm />
      <PageFooter />
    </FormLayout>
  );
}
