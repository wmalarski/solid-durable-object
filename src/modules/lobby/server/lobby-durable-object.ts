import { DurableObject } from "cloudflare:workers";
import type { LobbyData } from "./types";

const MAX_LOBBY_SIZE = 2;

export class LobbyDurableObject extends DurableObject<Env> {
	private fullLobbies = new Set<DurableObjectId>();
	private readyLobbies = [] as DurableObjectId[];
	private lobbies = new Map<DurableObjectId, LobbyData>();
	private userLobbies = new Map<string, DurableObjectId>();

	// constructor(state: DurableObjectState, env: Env) {
	//   super(state, env);

	//   this.ctx.blockConcurrencyWhile(async () => {
	//     const stored = await this.ctx.storage.get("value");
	//     // After initialization, future reads do not need to access storage.
	//     this.value = stored || 0;
	//   });
	// }
	// this.ctx.storage.put("full_lobbies", new Set<string>());
	// this.ctx.storage.put("ready_lobbies", [] as string[]);
	// this.ctx.storage.put("lobbies", new Map<string, LobbyData>());

	joinLobby(playerId: string) {
		console.log("[joinLobby]", { playerId });

		const lobbyId = this.readyLobbies.pop();
		const lobby = lobbyId ? this.lobbies.get(lobbyId) : null;

		console.log("[joinLobby]", { lobbyId, lobby });

		if (!lobby || lobby.userIps.length >= MAX_LOBBY_SIZE) {
			const newLobbyId = this.env.BoardDurableObject.newUniqueId();

			this.lobbies.set(newLobbyId, { id: newLobbyId, userIps: [playerId] });
			this.readyLobbies.push(newLobbyId);
			this.userLobbies.set(playerId, newLobbyId);

			console.log("[joinLobby]", {
				newLobbyId,
				lobbies: this.lobbies,
				readyLobbies: this.readyLobbies,
				userLobbies: this.userLobbies,
				fullLobbies: this.fullLobbies,
			});

			return newLobbyId.toString();
		}

		lobby.userIps.push(playerId);
		this.userLobbies.set(playerId, lobby.id);

		if (lobby.userIps.length < MAX_LOBBY_SIZE) {
			this.readyLobbies.push(lobby.id);
		} else {
			this.fullLobbies.add(lobby.id);
		}

		console.log("[joinLobby]", {
			lobby,
			lobbies: this.lobbies,
			readyLobbies: this.readyLobbies,
			userLobbies: this.userLobbies,
			fullLobbies: this.fullLobbies,
		});

		return lobby.id.toString();
	}

	leaveLobby(userIp: string) {
		const lobbyId = this.userLobbies.get(userIp);
		const lobby = lobbyId ? this.lobbies.get(lobbyId) : null;

		if (!lobby) {
			return;
		}

		this.userLobbies.delete(userIp);
		const userIndex = lobby.userIps.findIndex((ip) => ip === userIp);
		userIndex >= 0 && lobby.userIps.splice(userIndex, 1);
		const deleted = this.fullLobbies.delete(lobby.id);

		if (deleted) {
			this.readyLobbies.push(lobby.id);
		}

		if (lobby.userIps.length === 0) {
			this.lobbies.delete(lobby.id);
			const index = this.readyLobbies.findIndex((entry) =>
				entry.equals(lobby.id),
			);
			index >= 0 && this.readyLobbies.splice(index, 1);
		}
	}

	hasLobby(lobbyId: DurableObjectId) {
		return this.lobbies.keys().some((id) => id.equals(lobbyId));
	}
}
