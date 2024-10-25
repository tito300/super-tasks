import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  IconButton,
  MenuList,
  Paper,
  Stack,
  StackProps,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { constants } from "@src/config/constants";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  LlmModel,
  llmModels,
  useChatGptState,
} from "../Providers/ChatGptStateProvider";
import { useDebugValue, useEffect, useLayoutEffect, useState } from "react";
import { useServicesContext } from "../Providers/ServicesProvider";
import { Chip } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Menu } from "@mui/material";
import { MenuItem } from "@mui/material";
import Markdown from "react-markdown";
import { AppControls } from "../shared/AppControls";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useRootElement } from "@src/hooks/useRootElement";
import { useUserState } from "../Providers/UserStateProvider";
import { useLogRender } from "@src/hooks/useLogRender";
import { useScrollableEl } from "@src/hooks/useScrollableEl";
import { useDebouncedCallback } from "@src/hooks/useDebouncedCallback";
import { AiRewriteActions } from "./AiRewriteActions";

// prevents prism from automatically highlighting code blocks on page
// @ts-expect-error
window.Prism = window.Prism || {};
// @ts-expect-error
window.Prism.manual = true;

export const ChatGpt = () => {
  return (
    <Container>
      <ChatGptControls />
      <ConversationsList />
      <Conversation />
      <AiRewriteActions />
    </Container>
  );
};

export const ChatGptControls = (props: {}) => {
  const { data: chatGptState, updateData } = useChatGptState();
  const handleResetClick = () => {
    updateData({ messages: [], composerDraft: "" });
  };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleChangeModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleModelClick = (model: LlmModel) => {
    updateData({ model });
    handleClose();
  };

  return (
    <AppControls
      settingsOpen={false}
      onSettingsClick={() => {}}
      reloading={false}
      onReloadClick={handleResetClick}
      reloadIcon={<DeleteForeverIcon />}
    >
      <Chip
        variant="outlined"
        size={"small"}
        sx={{ textTransform: "uppercase" }}
        label={chatGptState.model}
        onClick={handleChangeModalClick}
        onDelete={handleChangeModalClick}
        deleteIcon={<KeyboardArrowDownIcon />}
      />
      <Menu
        id="model-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuList dense>
          {llmModels.map((model) => (
            <MenuItem
              sx={{ textTransform: "uppercase" }}
              onClick={() => handleModelClick(model)}
            >
              {model}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </AppControls>
  );
};

const Container = styled(Stack)({
  position: "relative",
  createdAt: Date.now(),
  width: "100%",
  height: "100%",
});

export const ConversationsList = () => {
  // todo
  return null;
};

export const MessagesContainer = styled(Stack)<{ empty: boolean }>(
  ({ theme, empty }) => ({
    flex: 1,
    gap: theme.spacing(2),
    padding: theme.spacing(0, 1, 1),
    justifyContent: empty ? "flex-end" : "initial",
  })
);

export const MessageComposer = ({
  onSubmit,
  ...rest
}: Omit<StackProps, "onSubmit"> & {
  onSubmit: (message: string) => void;
}) => {
  const {
    data: { composerDraft },
    updateData,
  } = useChatGptState();
  const [value, setValue] = useState(composerDraft);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    setValue(composerDraft);
  }, [composerDraft]);

  useDebouncedCallback(
    value,
    (debouncedValue) => {
      updateData({ composerDraft: debouncedValue });
    },
    1000 // high number because if there are many tabs open this could be a performance issue
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit(composerDraft);
    }
  };

  return (
    <Stack {...rest} direction="row" spacing={2} pb={1} alignItems="center">
      <TextField
        value={value}
        variant="filled"
        placeholder="Type a message"
        fullWidth
        size="small"
        hiddenLabel
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
      <IconButton color="primary" onClick={() => onSubmit(composerDraft)}>
        <SendIcon />
      </IconButton>
    </Stack>
  );
};

const ConversationFooter = styled(Stack)(({ theme }) => ({
  position: "sticky",
  bottom: 0,
  justifyContent: "flex-end",
  flexGrow: 1,
  backgroundColor: "white",
  padding: theme.spacing(0.75, 0, 0),
}));

export const Conversation = () => {
  const [mounted, setMounted] = useState(false);
  const scrollableEl = useScrollableEl();
  const {
    data: { messages, pending, model },
    updateData,
    dataSyncing,
  } = useChatGptState();
  const {
    data: { currentTab, buttonExpanded },
  } = useUserState();
  const { chatGpt } = useServicesContext();

  const scrollToBottom = () => {
    if (scrollableEl) {
      scrollableEl.scrollTop = scrollableEl.scrollHeight;
    }
  };

  const scrollToMsgTop = (id: number) => {
    if (!scrollableEl) return;

    const el = scrollableEl.querySelector(
      `#${constants.EXTENSION_NAME}-message-${id}`
    ) as HTMLDivElement | null;

    if (el) {
      scrollableEl.scrollTo({ behavior: "smooth", top: el.offsetTop - 150 });
    }
  };

  useLayoutEffect(() => {
    if (currentTab !== "chatGpt" || !buttonExpanded) return;
    scrollToBottom();
  }, [scrollableEl, currentTab, buttonExpanded]);

  const handleSubmit = (message: string) => {
    let messagesClone = [
      ...messages,
      {
        message,
        direction: "outbound",
        createdAt: Date.now(),
        id: Date.now(),
      } as const,
    ];
    updateData({
      messages: messagesClone,
      composerDraft: "",
      pending: true,
    });
    setTimeout(() => {
      scrollToBottom();
    }, 100);

    chatGpt
      .getChatGptResponse(messagesClone, model)
      .then((response) => {
        messagesClone = [...messagesClone, response];
        updateData({ messages: messagesClone, pending: false });
        setTimeout(() => {
          scrollToMsgTop(response.id);
        }, 100);
      })
      .catch((error) => {
        console.error(error);
        updateData({
          composerDraft: message,
          pending: false,
        });
      });
  };

  return (
    <MessagesContainer
      ref={(el) => {
        if (el) {
          setMounted(true);
        } else {
          setMounted(false);
        }
      }}
      flex={1}
      empty={!messages?.length}
    >
      {messages?.length ? (
        messages.map((message) => {
          return (
            <Message
              id={`${constants.EXTENSION_NAME}-message-${message.id}`}
              key={message.id}
              message={message}
            />
          );
        })
      ) : (
        <Typography
          alignSelf={"center"}
          textAlign={"center"}
          variant="h5"
          color={"GrayText"}
          sx={{ flex: 1, paddingTop: "140px", opacity: 0.7 }}
        >
          How can I help you today?
        </Typography>
      )}
      <ConversationFooter gap={2}>
        {pending && <TypingIndicator />}
        <MessageComposer onSubmit={handleSubmit} />
      </ConversationFooter>
    </MessagesContainer>
  );
};

// three dots jumping animation
export const TypingIndicator = () => {
  return (
    <Stack
      direction="row"
      justifyContent="start"
      gap={0.5}
      paddingLeft={2}
      alignItems="center"
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          backgroundColor: "GrayText",
          borderRadius: "50%",
          animation: "jump 1s infinite",
          "@keyframes jump": {
            "0%, 50%, 100%": {
              transform: "translateY(0)",
            },
            "25%": {
              transform: "translateY(-4px)",
            },
            "75%": {
              transform: "translateY(4px)",
            },
          },
        }}
      />
      <Box
        sx={{
          width: 8,
          height: 8,
          backgroundColor: "GrayText",
          borderRadius: "50%",
          animation: "jump 1s infinite",
          animationDelay: "0.1s",
        }}
      ></Box>
      <Box
        sx={{
          width: 8,
          height: 8,
          backgroundColor: "GrayText",
          borderRadius: "50%",
          animation: "jump 1s infinite",
          animationDelay: "0.2s",
        }}
      ></Box>
    </Stack>
  );
};

export type Message = {
  id: number;
  message: string;
  direction: "inbound" | "outbound";
  createdAt: number;
};

export const MessageContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  "& p": {
    margin: 0,
  },
}));

export const Message = ({
  message,
  ...rest
}: { message: Message } & StackProps) => {
  const {
    data: { blurText },
  } = useUserState();
  const inbound = message.direction === "inbound";

  useLogRender("Message");

  return (
    <MessageContainer
      direction={inbound ? "row" : "row-reverse"}
      spacing={1}
      {...rest}
    >
      <Avatar
        sx={{ width: 24, height: 24 }}
        src={inbound ? chrome.runtime.getURL("chatgpt-icon.png") : undefined}
      >
        {message.direction[0].toUpperCase()}
      </Avatar>
      <Paper
        elevation={inbound ? 0 : 2}
        sx={{
          padding: inbound ? 0 : 1,
          borderRadius: 2,
          filter: blurText ? "blur(7px)" : "none",
        }}
      >
        {" "}
        {inbound ? (
          <Markdown
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
                    // @ts-expect-error
                    style={{
                      ...tomorrow,
                      'pre[class*="language-"]': {
                        ...tomorrow['pre[class*="language-"]'],
                        width: 300,
                      },
                    }}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.message}
          </Markdown>
        ) : (
          <Typography>{message.message}</Typography>
        )}
      </Paper>
    </MessageContainer>
  );
};
