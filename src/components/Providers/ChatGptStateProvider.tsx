import { createContext, useContext } from "react";
import { useSyncedState } from "@src/hooks/useSyncedState";
import { ChatMessage } from "@src/chatGpt.types";
import { useChatGptSettings } from "./ChatGptSettingsProvider";
// import { useChatGptSettings } from "./ChatGptSettingsProvider";

export const llmModels = [
  {
    label: "GPT 4o",
    value: "gpt-4o",
  },
  {
    label: "GPT 4o mini",
    value: "gpt-4o-mini",
  },
  {
    label: "GPT 3.5 Turbo",
    value: "gpt-3.5-turbo",
  },
  // {
  //   label: "GPT o1 mini",
  //   value: "o1-mini",
  // },
  // {
  //   label: "GPT o1 preview",
  //   value: "o1-preview",
  // },
] as const;
export type LlmModel = (typeof llmModels)[number];

export type ChatGptState = {
  messages: ChatMessage[];
  composerDraft: string;
  pending: boolean;
  model: LlmModel["value"];
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
