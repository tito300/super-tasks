import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Divider,
  Fab,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Paper,
  Stack,
  StackProps,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import chatGptIcon from "@assets/img/chatgpt-icon.png";
import { constants } from "@src/config/constants";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useSyncedState } from "@src/hooks/useSyncedState";
import { useChatGptState } from "../Providers/ChatGptStateProvider";
import { useEffect, useState } from "react";
import { useServicesContext } from "../Providers/ServicesProvider";

const messages = [
  {
    id: 1,
    message: "message sent",
    direction: "outbound",
    createdAt: Date.now(),
  },
  {
    id: 2,
    message: "message received",
    direction: "inbound",
    createdAt: Date.now(),
  },
  {
    id: 3,
    message: "message sent",
    direction: "outbound",
    createdAt: Date.now(),
  },
  {
    id: 4,
    message: "message received",
    direction: "inbound",
    createdAt: Date.now(),
  },
  {
    id: 5,
    message: "message sent",
    direction: "outbound",
    createdAt: Date.now(),
  },
  {
    id: 6,
    message: "message received",
    direction: "inbound",
    createdAt: Date.now(),
  },
  {
    id: 7,
    message: "message sent",
    direction: "outbound",
    createdAt: Date.now(),
  },
  {
    id: 8,
    message: "message received",
    direction: "inbound",
    createdAt: Date.now(),
  },
  {
    id: 9,
    message: "message sent",
    direction: "outbound",
    createdAt: Date.now(),
  },
  {
    id: 10,
    message: "message received",
    direction: "inbound",
    createdAt: Date.now(),
  },
  {
    id: 11,
    message: "message sent",
    direction: "outbound",
    createdAt: Date.now(),
  },
  {
    id: 12,
    message: "message received",
    direction: "inbound",
    createdAt: Date.now(),
  },
  {
    id: 13,
    message: "message sent",
    direction: "outbound",
    createdAt: Date.now(),
  },
  {
    id: 14,
    message: "message received",
    direction: "inbound",
    createdAt: Date.now(),
  },
  {
    id: 15,
    message: "message sent",
    direction: "outbound",
    createdAt: Date.now(),
  },
  {
    id: 16,
    message: "message received",
    direction: "inbound",
    createdAt: Date.now(),
  },
  {
    id: 17,
    message: "message sent",
    direction: "outbound",
    createdAt: Date.now(),
  },
  {
    id: 18,
    message:
      "message received message received message received message received",
    direction: "inbound",
    createdAt: Date.now(),
  },
  {
    id: 19,
    message: "message sent message sent",
    direction: "outbound",
    createdAt: Date.now(),
  },
  {
    id: 20,
    message: "message received",
    direction: "inbound",
    createdAt: Date.now(),
  },
] as const;

export const ChatGpt = () => {
  return (
    <Container>
      <ChatGptControls />
      <ConversationsList />
      <Conversation />
    </Container>
  );
};

export const ChatGptControls = (props: {}) => {
  const { updateData } = useChatGptState();
  const handleResetClick = () => {
    updateData({ messages: [], composerDraft: "" });
  };
  return (
    <>
      <Box py={3} width={"100%"}></Box>
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent={"space-between"}
        {...props}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 400,
          // boxShadow: `0px 3px 5px -2px rgb(0 0 0 / 11%), 0px 3px 4px 0px rgb(0 0 0 / 0%), 0px 1px 8px 0px rgb(0 0 0 / 4%)`,
          backgroundColor: (theme) => theme.palette.background.paper,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Tooltip title="start over">
          <IconButton
            sx={{ ml: "auto" }}
            size="small"
            onClick={handleResetClick}
          >
            <DeleteForeverIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </>
  );
};

const Container = styled(Stack)({
  position: "relative",
  createdAt: Date.now(),
  width: "100%",
  height: constants.EXTENSION_HEIGHT,
});

export const ConversationsList = () => {
  // todo
  return null;
};

export const MessagesContainer = styled(Stack)<{ empty: boolean }>(
  ({ theme, empty }) => ({
    flex: 1,
    height: constants.EXTENSION_HEIGHT,
    overflow: "auto",
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ composerDraft: e.target.value });
  };

  return (
    <Stack {...rest} direction="row" spacing={2} alignItems="center">
      <TextField
        value={composerDraft}
        variant="filled"
        placeholder="Type a message"
        fullWidth
        size="small"
        hiddenLabel
        multiline
        onChange={handleChange}
      />
      <IconButton color="primary" onClick={() => onSubmit(composerDraft)}>
        <SendIcon />
      </IconButton>
    </Stack>
  );
};

const ConversationFooter = styled(Stack)({
  flexGrow: 1,
  justifyContent: "flex-end",
});

export const Conversation = () => {
  const {
    data: { messages, pending },
    updateData,
    dataSyncing,
  } = useChatGptState();
  const { chatGpt } = useServicesContext();

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

    chatGpt
      .getChatGptResponse(message)
      .then((response) => {
        messagesClone = [...messagesClone, response];
        updateData({ messages: messagesClone, pending: false });
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
          // scroll to bottom
          el.scrollTop = el.scrollHeight;
        }
      }}
      flex={1}
      empty={!messages?.length}
    >
      {messages?.length ? (
        messages.map((message) => {
          return <Message key={message.id} message={message} />;
        })
      ) : (
        <Typography
          alignSelf={"center"}
          textAlign={"center"}
          variant="h5"
          color={"GrayText"}
          sx={{ flex: 1, paddingTop: "200px", opacity: 0.7 }}
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
}));

export const Message = ({ message }: { message: Message }) => {
  const inbound = message.direction === "inbound";
  return (
    <MessageContainer direction={inbound ? "row" : "row-reverse"} spacing={1}>
      <Avatar
        sx={{ width: 24, height: 24 }}
        src={inbound ? chatGptIcon : undefined}
      >
        {message.direction[0].toUpperCase()}
      </Avatar>
      <Paper
        elevation={inbound ? 0 : 2}
        sx={{ padding: inbound ? 0 : 1, borderRadius: 2 }}
      >
        <Typography>{message.message}</Typography>
      </Paper>
    </MessageContainer>
  );
};
