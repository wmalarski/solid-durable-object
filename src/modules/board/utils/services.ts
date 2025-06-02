import { query } from "@solidjs/router";
import type { HonoClient } from "~/modules/shared/hono-client";

type GetBoardConfigArgs = {
  honoClient: HonoClient;
  gameId: string;
};

export const getBoardConfig = query(
  async ({ honoClient, gameId }: GetBoardConfigArgs) => {
    const result = await honoClient.api.board.config[":gameId"]
      .$get({ param: { gameId } })
      .then((response) => response.json());

    return result;
  },
  "getBoardConfig",
);

export type GetBoardConfigReturn = Awaited<ReturnType<typeof getBoardConfig>>;
