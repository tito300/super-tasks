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
  isSelectedText?: boolean;
  isAdditionalText?: boolean;
};

export type ChatMessage = ChatGptMessage;
