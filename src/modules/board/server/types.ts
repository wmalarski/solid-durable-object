export type WebsocketMessage = {
  text: string;
  user: string;
  createdAt: string;
};

export type WebsocketChatSendMessage = {
  content: string;
};

export type WebsocketChatServerMessage = {
  message: string;
  user: string;
};
