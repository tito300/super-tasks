export type ChatGptMessage = {
  id: number;
  message: string;
  direction: "inbound" | "outbound";
  createdAt: number;
  fullPage?: boolean;
  fullPageUrl?: string;
  fullPageTitle?: string;
  fullPageDomain?: string;
  error?: boolean;
};

export type ChatMessage = ChatGptMessage;
