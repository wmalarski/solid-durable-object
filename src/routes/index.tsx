import { JoinForm } from "~/modules/game/join/join-form";
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
