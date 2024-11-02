import { createContext, useContext } from "react";
import { useSyncedState } from "@src/hooks/useSyncedState";
import { ChatMessage } from "@src/chatGpt.types";
import { useChatGptSettings } from "./ChatGptSettingsProvider";
// import { useChatGptSettings } from "./ChatGptSettingsProvider";

export const llmModels = [
  "gpt-3.5-turbo",
  "gpt-4o-mini",
  "chatgpt-4o-latest",
] as const;
export type LlmModel = (typeof llmModels)[number];

export type ChatGptState = {
  messages: ChatMessage[];
  composerDraft: string;
  pending: boolean;
  model: LlmModel;
  aiOptions: {
    keepShort: boolean;
  };
};

export type ChatGptStateContextType = ReturnType<
  typeof useSyncedState<ChatGptState>
>;

export const chatGptStateDefaults = {
  messages: [],
  composerDraft: "",
  pending: false,
  model: "gpt-4o-mini" as const,
  aiOptions: {
    keepShort: false,
  },
};

const ChatGptStateContext = createContext<ChatGptStateContextType>(null!);
export function ChatGptStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { chatGptSettings } = useChatGptSettings();
  const syncedState = useSyncedState<ChatGptState>(
    "chatGptState",
    chatGptSettings,
    chatGptStateDefaults
  );

  return (
    <ChatGptStateContext.Provider value={syncedState}>
      {children}
    </ChatGptStateContext.Provider>
  );
}

export const useChatGptState = () => {
  const context = useContext(ChatGptStateContext);
  if (!context) {
    throw new Error(
      "useChatGptState must be used within a ChatGptGlobalStateProvider"
    );
  }
  return context;
};
