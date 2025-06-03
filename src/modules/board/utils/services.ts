import { query } from "@solidjs/router";
import { makeHonoClient } from "~/modules/shared/hono-client";

type GetBoardConfigQueryArgs = {
	gameId: string;
};

export const getBoardConfigQuery = query(
	async ({ gameId }: GetBoardConfigQueryArgs) => {
		const honoClient = makeHonoClient();

		console.log("[getBoardConfigQuery]", { gameId });

		try {
			const result = await honoClient.api.board.config[":gameId"]
				.$get({ param: { gameId } })
				.then((response) => response.json());

			console.log("[getBoardConfigQuery]", { result });

			return null;
		} catch (error) {
			console.log("[getBoardConfigQuery]", error);
		}
		return null;
	},
	"getBoardConfig",
);

export type GetBoardConfigReturn = Awaited<
	ReturnType<typeof getBoardConfigQuery>
>;
