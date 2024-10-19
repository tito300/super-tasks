export type ChatGptMessage = {
  id: number;
  message: string;
  direction: "inbound" | "outbound";
  createdAt: number;
};

export type ChatMessage = ChatGptMessage;
