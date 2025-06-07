import { DurableObject } from "cloudflare:workers";

const MAX_LOBBY_SIZE = 2;

export class LobbyDurableObject extends DurableObject<Env> {
  //   private fullLobbies = new Set<DurableObjectId>();
  //   private readyLobbies = [] as DurableObjectId[];
  //   private lobbies = new Map<DurableObjectId, LobbyData>();
  //   private userLobbies = new Map<string, DurableObjectId>();

  userLobby = new Map<string, Set<string>>();

  lastPlayerId: string | undefined;

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

  join(lobbyId: string, playerId: string) {
    let lobby = this.userLobby.get(lobbyId);

    if (!lobby) {
      lobby = new Set<string>();
      this.userLobby.set(lobbyId, lobby);
    }

    lobby.add(playerId);
  }

  leave(lobbyId: string, playerId: string) {
    const lobby = this.userLobby.get(lobbyId);
    if (!lobby) {
      return;
    }

    const hadPlayer = lobby.delete(playerId);
    if (hadPlayer && lobby.size === 0) {
      this.userLobby.delete(lobbyId);
    }
  }

  getReadyLobby() {
    console.log("[getReadyLobby]", this.userLobby.entries().toArray());

    return this.userLobby
      .entries()
      .find(([_lobbyId, playerSet]) => playerSet.size < MAX_LOBBY_SIZE)?.[0];
  }

  addLobby(lobbyId: string) {
    this.userLobby.set(lobbyId, new Set());
  }

  hasLobby(lobbyId: string) {
    return this.userLobby.has(lobbyId);
  }

  //   joinLobby(playerId: string) {
  //     console.log("[joinLobby]", { playerId });

  //     const lobbyId = this.readyLobbies.pop();
  //     const lobby = lobbyId ? this.lobbies.get(lobbyId) : null;

  //     console.log("[joinLobby]", { lobby, lobbyId });

  //     if (!lobby || lobby.userIps.length >= MAX_LOBBY_SIZE) {
  //       const newLobbyId = this.env.BoardDurableObject.newUniqueId();

  //       this.lobbies.set(newLobbyId, { id: newLobbyId, userIps: [playerId] });
  //       this.readyLobbies.push(newLobbyId);
  //       this.userLobbies.set(playerId, newLobbyId);

  //       console.log("[joinLobby]", {
  //         fullLobbies: this.fullLobbies,
  //         lobbies: this.lobbies,
  //         newLobbyId,
  //         readyLobbies: this.readyLobbies,
  //         userLobbies: this.userLobbies,
  //       });

  //       return newLobbyId.toString();
  //     }

  //     lobby.userIps.push(playerId);
  //     this.userLobbies.set(playerId, lobby.id);

  //     if (lobby.userIps.length < MAX_LOBBY_SIZE) {
  //       this.readyLobbies.push(lobby.id);
  //     } else {
  //       this.fullLobbies.add(lobby.id);
  //     }

  //     console.log("[joinLobby]", {
  //       fullLobbies: this.fullLobbies,
  //       lobbies: this.lobbies,
  //       lobby,
  //       readyLobbies: this.readyLobbies,
  //       userLobbies: this.userLobbies,
  //     });

  //     return lobby.id.toString();
  //   }

  //   leaveLobby(userIp: string) {
  //     const lobbyId = this.userLobbies.get(userIp);
  //     const lobby = lobbyId ? this.lobbies.get(lobbyId) : null;

  //     if (!lobby) {
  //       return;
  //     }

  //     this.userLobbies.delete(userIp);
  //     const userIndex = lobby.userIps.findIndex((ip) => ip === userIp);
  //     userIndex >= 0 && lobby.userIps.splice(userIndex, 1);
  //     const deleted = this.fullLobbies.delete(lobby.id);

  //     if (deleted) {
  //       this.readyLobbies.push(lobby.id);
  //     }

  //     if (lobby.userIps.length === 0) {
  //       this.lobbies.delete(lobby.id);
  //       const index = this.readyLobbies.findIndex((entry) =>
  //         entry.equals(lobby.id),
  //       );
  //       index >= 0 && this.readyLobbies.splice(index, 1);
  //     }
  //   }
}
