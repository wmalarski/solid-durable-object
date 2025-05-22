// @refresh reload

import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <link href="/favicon.ico" rel="icon" />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));

// export class $DurableObject extends DurableObject {
//   fetch(request: Request) {
//     return ws.handleDurableUpgrade(this, request);
//   }
//   webSocketMessage(client: WebSocket, message: string | ArrayBuffer) {
//     return ws.handleDurableMessage(this, client, message);
//   }
//   webSocketClose(
//     client: WebSocket,
//     code: number,
//     reason: string,
//     wasClean: boolean,
//   ) {
//     return ws.handleDurableClose(this, client, code, reason, wasClean);
//   }
// }
