import { CacheProvider } from "@emotion/react";
import { WashRounded } from "@mui/icons-material";
import {
  Button,
  Chip,
  ClickAwayListener,
  IconButton,
  Paper,
  Popper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useUserTypingInput } from "@src/hooks/useUserTypingInput";
import { commonTheme } from "@src/theme/common.theme";
import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import createCache from "@emotion/cache";
import { styled } from "@mui/material";
import { PopperProps } from "@mui/base";
import { constants } from "@src/config/constants";
import { Stack } from "@mui/material";
import { useChatGptState } from "../Providers/ChatGptStateProvider";
import { useServicesContext } from "../Providers/ServicesProvider";

const Container = styled("div")({});

export function AiRewriteActions() {
  const [openRewriteModal, setOpenRewriteModal] = useState(false);
  const { typingInput, updateInput, container } = useUserTypingInput();

  const OpenRewriteModal = () => {
    setOpenRewriteModal(!openRewriteModal);
    setOpenRewriteModal(true);
  };

  const handleClose = () => {
    setOpenRewriteModal(false);
  };

  if (!container || !typingInput) return null;

  return (
    <>
      <StyledPortal container={container.parentElement!}>
        <IconButton size="small" color="primary" onClick={OpenRewriteModal}>
          <WashRounded />
        </IconButton>
        <StyledPopper
          open={openRewriteModal}
          anchorEl={container}
          placement="bottom"
        >
          <AiReWriteModal
            input={typingInput}
            updateInput={updateInput}
            onClose={handleClose}
          />
        </StyledPopper>
      </StyledPortal>
    </>
  );
}

export const tones = [
  "Formal",
  "Friendly",
  "Informal",
  "Professional",
  "Positive",
  "Legal",
  "Proper",
  "Casual",
  "Neutral",
  "Emotional",
] as const;

export type Tone = (typeof tones)[number];

export const containsHtml = (input: string) => {
  return /<[^>]*>/.test(input);
};

function AiReWriteModal({
  input,
  updateInput,
  onClose,
}: {
  input: string;
  updateInput: (input: string) => void;
  onClose: () => void;
}) {
  const [selectedTones, setSelectedTones] = useState<Array<Tone>>([]);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const { chatGpt } = useServicesContext();

  const handleSubmit = () => {
    console.log("Suggesting", selectedTones);
    chatGpt.suggestRewrite(selectedTones, input).then((res) => {
      setSuggestion(res.message);
    });
  };

  const handleToneClick = (tone: Tone) => {
    if (selectedTones.includes(tone)) {
      setSelectedTones((tones) => tones.filter((t) => t !== tone));
    } else {
      setSelectedTones((tones) => [...tones, tone]);
    }
  };

  const handleAcceptSuggestion = () => {
    updateInput(suggestion!);
    setSuggestion(null);
    onClose();
  };
  const handleRejectSuggestion = () => {
    setSuggestion(null);
    onClose();
  };

  const html = containsHtml(input);

  if (suggestion)
    return (
      <AiReWriteModalContainer>
        <Stack>
          <Typography variant="h5">Suggestion:</Typography>
          {html ? (
            <div dangerouslySetInnerHTML={{ __html: suggestion }}></div>
          ) : (
            <Typography>{suggestion}</Typography>
          )}
        </Stack>
        <Stack direction="row" justifyContent="flex-end">
          <Button size="small" onClick={handleAcceptSuggestion}>
            Accept
          </Button>
          <Button size="small" onClick={handleRejectSuggestion}>
            Reject
          </Button>
        </Stack>
      </AiReWriteModalContainer>
    );

  return (
    <ClickAwayListener onClickAway={onClose}>
      <AiReWriteModalContainer>
        <Stack gap={2}>
          <Stack>
            <Typography variant="h5">AI Rewrite Suggestion</Typography>
            <Typography>
              Chose the tones you want the message to be in
            </Typography>
          </Stack>
          <Stack gap={0.25} direction="row" flexWrap="wrap">
            {tones.map((tone) => (
              <ToneChip
                onClick={() => handleToneClick(tone)}
                variant={selectedTones.includes(tone) ? "filled" : "outlined"}
                label={tone}
              />
            ))}
          </Stack>
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={handleSubmit}
            >
              Suggest
            </Button>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={onClose}
            >
              Close
            </Button>
          </Stack>
        </Stack>
      </AiReWriteModalContainer>
    </ClickAwayListener>
  );
}

const AiReWriteModalContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  width: "350px",
  maxHeight: "500px",
  overflowY: "auto",
}));

const ToneChip = styled(Chip)({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.1)",
  },
});

function StyledPopper({
  children,
  ...rest
}: { children: React.ReactNode } & PopperProps) {
  const [containerEl, setOpenRewriteContainerEl] =
    useState<HTMLDivElement | null>(null);

  const cache = useMemo(() => {
    if (!containerEl) return null;

    return createCache({
      key: `${constants.EXTENSION_NAME}-css`,
      container: containerEl as HTMLElement,
    });
  }, [containerEl]);

  return (
    <Popper style={{ zIndex: 1000 }} {...rest}>
      <Container ref={(el) => setOpenRewriteContainerEl(el)}>
        {cache && <CacheProvider value={cache!}>{children}</CacheProvider>}
      </Container>
    </Popper>
  );
}

function StyledPortal({
  children,
  container,
}: {
  children: React.ReactNode;
  container: HTMLElement;
}) {
  const [containerEl, setOpenRewriteContainerEl] =
    useState<HTMLDivElement | null>(null);

  const cache = useMemo(() => {
    if (!containerEl) return null;

    return createCache({
      key: `${constants.EXTENSION_NAME}-css`,
      container: containerEl as HTMLElement,
    });
  }, [containerEl]);
  return createPortal(
    <Container ref={(el) => setOpenRewriteContainerEl(el)}>
      {cache && (
        <CacheProvider value={cache!}>
          <ThemeProvider theme={commonTheme}>{children}</ThemeProvider>
        </CacheProvider>
      )}
    </Container>,
    container
  );
}
