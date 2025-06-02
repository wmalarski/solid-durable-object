import { query } from "@solidjs/router";
import { useHonoClient } from "~/modules/shared/hono-client";

type GetBoardConfigQueryArgs = {
  gameId: string;
};

export const getBoardConfigQuery = query(
  async ({ gameId }: GetBoardConfigQueryArgs) => {
    const honoClient = useHonoClient();

    const result = await honoClient()
      .api.board.config[":gameId"].$get({ param: { gameId } })
      .then((response) => response.json());

    return result;
  },
  "getBoardConfig",
);

export type GetBoardConfigReturn = Awaited<
  ReturnType<typeof getBoardConfigQuery>
>;
