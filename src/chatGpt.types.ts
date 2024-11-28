export type ChatGptMessage = {
  id: number;
  message: string;
  direction: "inbound" | "outbound";
  type?: "message" | "action" | "history";
  createdAt: number;
  fullPage?: boolean;
  fullPageUrl?: string;
  fullPageTitle?: string;
  fullPageDomain?: string;
  error?: boolean;
  isSelectedText?: boolean;
  isAdditionalText?: boolean;
  limitReached?: boolean;
};

export type ChatMessage = ChatGptMessage;
