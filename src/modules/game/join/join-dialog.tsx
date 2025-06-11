import { useSubmission } from "@solidjs/router";
import type { Component } from "solid-js";
import { Button } from "~/ui/button/button";
import {
  closeDialog,
  Dialog,
  DialogActions,
  DialogBackdrop,
  DialogBox,
  DialogClose,
  DialogTitle,
} from "~/ui/dialog/dialog";
import { useI18n } from "~/utils/i18n";
import { useActionOnSubmit } from "~/utils/use-action-on-submit";
import { useGameConfig } from "../contexts/game-config";
import { joinGameAction } from "../server/services";
import { JoinFields } from "./join-fields";

export const JoinDialog: Component = () => {
  const { t } = useI18n();

  const dialogId = "join-dialog";
  const formId = "join-form";

  const gameConfig = useGameConfig();

  const submission = useSubmission(joinGameAction);

  const onSubmit = useActionOnSubmit({
    action: joinGameAction,
    onSuccess: () => closeDialog(dialogId),
    resetOnSuccess: true,
  });

  const issues = submission.result?.success ? undefined : submission.result;

  return (
    <Dialog id={dialogId} open>
      <DialogBox>
        <DialogTitle>{t("join.join")}</DialogTitle>
        <form id={formId} onSubmit={onSubmit}>
          <input name="gameId" type="hidden" value={gameConfig().gameId} />
          <JoinFields issues={issues} pending={submission.pending} />
        </form>
        <DialogActions>
          <DialogClose />
          <Button
            color="primary"
            disabled={submission.pending}
            form={formId}
            isLoading={submission.pending}
            type="submit"
          >
            {t("join.join")}
          </Button>
        </DialogActions>
      </DialogBox>
      <DialogBackdrop />
    </Dialog>
  );
};
