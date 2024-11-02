export type ChatGptMessage = {
  id: number;
  message: string;
  direction: "inbound" | "outbound";
  createdAt: number;
  fullPage?: boolean;
  fullPageUrl?: string;
  error?: boolean;
};

export type ChatMessage = ChatGptMessage;
