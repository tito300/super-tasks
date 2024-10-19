import { createContext, useContext } from "react";
import { useSyncedState } from "@src/hooks/useSyncedState";
import { ChatMessage } from "@src/chatGpt.types";
import { useChatGptSettings } from "./ChatGptSettingsProvider";
// import { useChatGptSettings } from "./ChatGptSettingsProvider";

export type ChatGptState = {
  messages: ChatMessage[];
  composerDraft: string;
  pending: boolean;
};

export type ChatGptStateContextType = ReturnType<
  typeof useSyncedState<ChatGptState>
>;

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
    {
      messages: [],
      composerDraft: "",
      pending: false,
    }
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
