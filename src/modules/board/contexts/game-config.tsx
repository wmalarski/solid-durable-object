import { createAsync, useParams } from "@solidjs/router";
import {
	type Accessor,
	type Component,
	createContext,
	createMemo,
	type ParentProps,
	Show,
	useContext,
} from "solid-js";
import {
	type GetBoardConfigReturn,
	getBoardConfigQuery,
} from "../utils/services";

const createGameConfig = (
	gameId: string,
	boardConfig?: GetBoardConfigReturn,
) => {
	return { boardConfig, gameId };
};

const GameConfigContext = createContext<
	Accessor<ReturnType<typeof createGameConfig>>
>(() => {
	throw new Error("GameConfigContext not defined");
});

export const GameConfigProvider: Component<ParentProps> = (props) => {
	const params = useParams();

	const boardConfig = createAsync(() =>
		getBoardConfigQuery({ gameId: params.gameId }),
	);

	return (
		<Show when={boardConfig()}>
			{(config) => {
				const value = createMemo(() =>
					createGameConfig(params.gameId, config()),
				);
				return (
					<GameConfigContext.Provider value={value}>
						{props.children}
					</GameConfigContext.Provider>
				);
			}}
		</Show>
	);
};

export const useGameConfig = () => {
	return useContext(GameConfigContext);
};
