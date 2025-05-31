import { DurableObject } from "cloudflare:workers";

export class LobbyDurableObject extends DurableObject {
  // constructor(state: DurableObjectState, env: unknown) {
  //   super(state, env);
  // }
  // this.ctx.storage.put("full_lobbies", new Set<string>());
  // this.ctx.storage.put("ready_lobbies", [] as string[]);
  // this.ctx.storage.put("lobbies", new Map<string, LobbyData>());

  async joinLobby(_userId: string) {
    // this.ctx.st
  }

  async leaveLobby(_userId: string) {
    // this.ctx.st
  }

  getReadyLobby() {}
}
