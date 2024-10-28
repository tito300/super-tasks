import { CacheProvider } from "@emotion/react";
import { AutoFixHigh, Cancel } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Button,
  Chip,
  ClickAwayListener,
  CssBaseline,
  Divider,
  IconButton,
  Paper,
  PaperProps,
  Popover,
  PopoverProps,
  Popper,
  Skeleton,
  Snackbar,
  StackProps,
  SxProps,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useUserTypingInput } from "@src/hooks/useUserTypingInput";
import { commonTheme } from "@src/theme/common.theme";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import createCache from "@emotion/cache";
import { styled } from "@mui/material";
import { PopperProps } from "@mui/base";
import { constants } from "@src/config/constants";
import { Stack } from "@mui/material";
import { useServicesContext } from "../Providers/ServicesProvider";
import { FormControlLabel } from "@mui/material";
import { Checkbox } from "@mui/material";
import { useSelectedText } from "@src/hooks/useSelectedText";
import { StyledPortal } from "../shared/StyledProtal";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

// prevents prism from automatically highlighting code blocks on page
// @ts-expect-error
window.Prism = window.Prism || {};
// @ts-expect-error
window.Prism.manual = true;

const AiMessageTypography = styled(Typography)({
  whiteSpace: "pre-line",
});

function validRewriteInput(input: string) {
  if (!input) return false;

  // at least 3 words
  if (input.split(" ").length < 3) return false;

  return true;
}

export function AiRewriteActions() {
  const [hideIcon, setHideIcon] = useState(false);
  const [openRewriteModal, setOpenRewriteModal] = useState(false);
  const { typingInput, updateInput, container } = useUserTypingInput();
  const { selectedText } = useSelectedText();

  const OpenRewriteModal = () => {
    setOpenRewriteModal(!openRewriteModal);
    setOpenRewriteModal(true);
  };

  const handleClose = () => {
    setOpenRewriteModal(false);
  };

  const handleRemoveIcon = () => {
    setHideIcon(true);
  };

  if (selectedText) return null;
  if (hideIcon) return null;
  if (!container) return null;
  if (!validRewriteInput(typingInput)) return null;

  const containerStyles = window.getComputedStyle(container);
  const topOffset = -27 - (parseInt(containerStyles.paddingTop) || 0);
  const rightOffset = -(parseInt(containerStyles.paddingRight) || 0);

  return (
    <>
      <StyledPopper
        open
        anchorEl={container}
        placement="top-end"
        modifiers={[
          {
            name: "offset",
            enabled: true,
            options: {
              offset: [rightOffset, topOffset],
            },
          },
        ]}
      >
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            [`&:hover`]: {
              borderRadius: 8,
              backgroundColor: (theme) => theme.palette.grey[200],
              [` #${constants.EXTENSION_NAME}-remove-suggestion-icon`]: {
                display: "flex",
                translate: "transformX(0)",
                transition: "translate 0.2s",
              },
            },
          }}
        >
          <IconButton
            id={`${constants.EXTENSION_NAME}-remove-suggestion-icon`}
            sx={{
              display: "none",
              translate: "transformX(100%)",
            }}
            size="small"
            color="primary"
            onClick={handleRemoveIcon}
          >
            <Cancel />
          </IconButton>
          <IconButton size="small" color="primary" onClick={OpenRewriteModal}>
            <AutoFixHigh />
          </IconButton>
        </Stack>
      </StyledPopper>

      <AiReWriteModal
        input={typingInput}
        updateInput={updateInput}
        onClose={handleClose}
      />
    </>
  );
}

const AiTooltipButtons = forwardRef<
  HTMLDivElement,
  {
    expandDirection: "left" | "right";
    OpenRewriteModal: () => void;
    handleRemoveIcon: () => void;
  } & StackProps
>(function _AiTooltipButtons(
  { expandDirection, OpenRewriteModal, handleRemoveIcon, sx, ...rest },
  ref
) {
  return (
    <Stack
      ref={ref}
      direction={expandDirection === "right" ? "row-reverse" : "row"}
      alignItems="center"
      sx={{
        backgroundColor: (theme) => theme.palette.grey[200],
        borderRadius: "10px",
        [`&:hover`]: {
          borderRadius: "10px",
          backgroundColor: (theme) => theme.palette.grey[300],
          [` #${constants.EXTENSION_NAME}-remove-suggestion-icon`]: {
            display: "flex",
            translate: "transformX(0)",
            transition: "translate 0.2s",
          },
        },
        ...sx,
      }}
      {...rest}
    >
      <IconButton
        id={`${constants.EXTENSION_NAME}-remove-suggestion-icon`}
        sx={{
          display: "none",
          translate:
            expandDirection === "right"
              ? "transformX(-100%)"
              : "transformX(100%)",
        }}
        size="small"
        color="primary"
        onClick={handleRemoveIcon}
      >
        <Cancel />
      </IconButton>
      <IconButton size="small" color="primary" onClick={OpenRewriteModal}>
        <AutoFixHigh />
      </IconButton>
    </Stack>
  );
});

const AiOptionButton = styled(Button)({
  textTransform: "none",
  width: "100%",
  borderRadius: 0,
  borderBottomWidth: 0,
  "&:last-child": {
    borderBottomWidth: 1,
  },
});

export type AiTodo = "Explain" | "Rewrite" | "Summarize" | "Simplify";

export function AiSelectedText() {
  const { selectedText, selectedTextPositions } = useSelectedText();

  if (!selectedText) return null;

  return (
    <InternalAiSelectedText
      key={selectedText}
      selectedText={selectedText}
      selectedTextPositions={selectedTextPositions}
    />
  );
}
export function InternalAiSelectedText({
  selectedText,
  selectedTextPositions,
}: {
  selectedText: string;
  selectedTextPositions: SxProps;
}) {
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [hideAll, setHideAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<AiTodo | null>(null);
  const { chatGpt } = useServicesContext();

  const resetResults = () => {
    setErrorMessage("");
    setAiMessage(null);
  };

  const handleSubmit = (todo: AiTodo) => {
    resetResults();
    setLoading(true);

    const service =
      todo === "Explain"
        ? chatGpt.explain
        : todo === "Simplify"
        ? chatGpt.simplify
        : chatGpt.summarize;

    service({
      text: selectedText,
    })
      .then((res) => {
        setAiMessage(res.message);
      })
      .catch((error) => {
        setErrorMessage("Sorry, failed to suggest rewrite.");
      })
      .finally(() => setLoading(false));
  };

  const handleTodoClick = (todo: AiTodo) => {
    setSelectedTodo(todo);

    switch (todo) {
      case "Explain":
      case "Simplify":
      case "Summarize":
        handleSubmit(todo);
        break;
      case "Rewrite":
        break; // open rewrite modal
      default:
        break;
    }
  };

  if (!selectedText || hideAll) return null;

  return (
    <StyledPortal
      style={{ position: "absolute", top: 0, left: 0 }}
      container={document.body}
    >
      <AiTooltipButtons
        ref={containerRef}
        sx={selectedTextPositions}
        expandDirection="right"
        OpenRewriteModal={() => setOpen(true)}
        handleRemoveIcon={() => setHideAll(true)}
      />
      <AiModal
        open={open}
        title={
          loading
            ? "Working on it.."
            : selectedTodo && aiMessage
            ? `${selectedTodo} Result`
            : "What do you want to do?"
        }
        skeletonHeight={100}
        errorMessage={errorMessage}
        loading={loading}
        anchorEl={containerRef.current}
        onClose={() => setOpen(false)}
        buttons={
          <>
            {selectedTodo && (
              <>
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => setSelectedTodo(null)}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => handleSubmit(selectedTodo)}
                >
                  Retry
                </Button>
              </>
            )}
            <Button
              variant="outlined"
              size="small"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </>
        }
      >
        {!selectedTodo ? (
          <Stack direction="row" gap={0.5}>
            <ToneChip
              label="Explain"
              onClick={() => handleTodoClick("Explain")}
              variant="outlined"
            />
            <ToneChip
              label="Rewrite"
              onClick={() => handleTodoClick("Rewrite")}
              variant="outlined"
            />
            <ToneChip
              label="Summarize"
              onClick={() => handleTodoClick("Summarize")}
              variant="outlined"
            />
            <ToneChip
              label="Simplify"
              onClick={() => handleTodoClick("Simplify")}
              variant="outlined"
            />
          </Stack>
        ) : selectedTodo === "Rewrite" ? (
          <Stack gap={1}>Rewrite</Stack>
        ) : (
          <Stack gap={1}>
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
              {aiMessage!}
            </Markdown>
          </Stack>
        )}
      </AiModal>
    </StyledPortal>
  );
}

export const improvements = [
  "Improve Flow",
  "Professional",
  "Friendly",
  "concise",
  "Casual",
  "Positive",
  "Neutral",
  "Hyped",
] as const;

export type Tone = (typeof improvements)[number];

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
  const [selectedImprovements, setSelectedImprovements] = useState<Array<Tone>>(
    []
  );
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [inaccuracy, seInaccuracy] = useState<string | null>(null);
  const [hasInaccuracies, setHasInaccuracies] = useState(false);
  const { chatGpt } = useServicesContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkInaccuracies, setChecInaccuracies] = useState(false);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const [skeletonHeight, setSkeletonHeight] = useState(150);

  useEffect(() => {
    if (contentContainerRef.current) {
      setSkeletonHeight(contentContainerRef.current.clientHeight);
    }
  }, []);

  const handleSubmit = () => {
    resetResults();
    setLoading(true);
    chatGpt
      .suggestRewrite({
        improvements: selectedImprovements,
        input,
        checkInaccuracies,
      })
      .then((res) => {
        setSuggestion(res.message);
        seInaccuracy(res.inaccuracyMessage);
        setHasInaccuracies(res.hasInaccuracies);
      })
      .catch((error) => {
        setError("Sorry, failed to suggest rewrite.");
      })
      .finally(() => setLoading(false));
  };

  const handleToneClick = (tone: Tone) => {
    if (selectedImprovements.includes(tone)) {
      setSelectedImprovements((improvements) =>
        improvements.filter((t) => t !== tone)
      );
    } else {
      setSelectedImprovements((improvements) => [...improvements, tone]);
    }
  };

  function resetResults() {
    setSuggestion(null);
    seInaccuracy(null);
    setHasInaccuracies(false);
    setError(null);
  }

  const handleCopyClick = () => {
    // updateInput(suggestion!);
    navigator.clipboard.writeText(suggestion!);
    setSuggestion(null);
    onClose();
  };
  const handleRejectSuggestion = () => {
    setSuggestion(null);
    onClose();
  };

  const html = containsHtml(input);
  const showResults = suggestion || loading || hasInaccuracies;

  if (showResults)
    return (
      <AiModalContainer elevation={4}>
        <Stack gap={3.5}>
          <Stack gap={1}>
            <Typography variant="h5">Suggestion</Typography>
            <Divider />
            <Stack gap={1} minHeight={skeletonHeight}>
              {error && <Typography color="error">{error}</Typography>}
              {loading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={skeletonHeight}
                />
              ) : html ? (
                <div dangerouslySetInnerHTML={{ __html: suggestion! }}></div>
              ) : (
                <>
                  <AiMessageTypography>{suggestion}</AiMessageTypography>
                  {checkInaccuracies && inaccuracy && (
                    <Alert
                      severity={hasInaccuracies ? "warning" : "info"}
                      sx={{ whiteSpace: "pre-line" }}
                    >
                      <AlertTitle>Fact Check Result</AlertTitle>
                      {inaccuracy}
                    </Alert>
                  )}
                </>
              )}
            </Stack>
            <Stack direction="row" justifyContent="flex-end" gap={0.5}>
              {!error && suggestion && (
                <Button
                  variant="contained"
                  size="small"
                  disabled={loading}
                  onClick={handleCopyClick}
                >
                  Copy Text
                </Button>
              )}

              <Button
                variant="contained"
                size="small"
                color="info"
                disabled={loading}
                onClick={resetResults}
              >
                Retry
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={handleRejectSuggestion}
              >
                Close
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </AiModalContainer>
    );

  return (
    <ClickAwayListener onClickAway={onClose}>
      <AiModalContainer elevation={4}>
        <Stack gap={1}>
          <Typography variant="h5">
            {constants.EXTENSION_NAME_CAPITALIZED} Rewrite Suggestion
          </Typography>
          <Divider />
          <Stack ref={contentContainerRef} gap={1}>
            <Typography>Chose improvements desired</Typography>
            <Stack gap={0.35} direction="row" flexWrap="wrap">
              {improvements.map((tone) => (
                <ToneChip
                  onClick={() => handleToneClick(tone)}
                  variant={
                    selectedImprovements.includes(tone) ? "filled" : "outlined"
                  }
                  label={tone}
                />
              ))}
            </Stack>
            <Stack gap={1}>
              <FormControlLabel
                label="Fact Check"
                control={
                  <Checkbox
                    sx={{ p: 0.5, pl: 1 }}
                    size="small"
                    checked={checkInaccuracies}
                    onChange={(_, checked) => setChecInaccuracies(checked)}
                  />
                }
              />
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="flex-end" gap={0.5}>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={handleSubmit}
            >
              Run
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={onClose}
            >
              Close
            </Button>
          </Stack>
        </Stack>
      </AiModalContainer>
    </ClickAwayListener>
  );
}

const AiModalContainer = styled(Paper)(
  ({ theme }) =>
    ({
      width: "375px",
      maxHeight: "450px",
      overflowY: "auto",
      paddingTop: theme.spacing(1),
    } as const)
);

const ToneChip = styled(Chip)({
  cursor: "pointer",
  fontWeight: 600,
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.2)",
  },
});

const StyledPoPperContainer = styled("div")({});

function StyledPopper({
  children,
  sx,
  ...rest
}: { children: React.ReactNode; sx?: SxProps } & PopperProps) {
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
      <StyledPoPperContainer
        sx={sx}
        ref={(el) => setOpenRewriteContainerEl(el)}
      >
        {cache && (
          <CacheProvider value={cache!}>
            <ThemeProvider theme={commonTheme}>{children}</ThemeProvider>
          </CacheProvider>
        )}
      </StyledPoPperContainer>
    </Popper>
  );
}

function StyledPopover({
  children,
  sx,
  ...rest
}: { children: React.ReactNode; sx?: SxProps } & PopoverProps) {
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
    <Popover style={{ zIndex: 1000 }} {...rest}>
      <StyledPoPperContainer
        sx={sx}
        ref={(el) => setOpenRewriteContainerEl(el)}
      >
        {cache && (
          <CacheProvider value={cache!}>
            <ThemeProvider theme={commonTheme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </CacheProvider>
        )}
      </StyledPoPperContainer>
    </Popover>
  );
}

function AiModal({
  title,
  skeletonHeight,
  errorMessage,
  loading,
  children,
  buttons,
  open,
  anchorEl,
  onClose,
  ...rest
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  skeletonHeight?: number;
  errorMessage?: string;
  loading?: boolean;
  buttons?: React.ReactNode;
} & PaperProps) {
  return (
    <StyledPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <AiModalContainer elevation={4} {...rest}>
        <Stack gap={3.5}>
          <Stack gap={1}>
            <Typography
              variant="h6"
              sx={{
                textTransform: "none",
                px: (theme) => theme.spacing(2.5),
              }}
            >
              {title}
            </Typography>
            <Divider />
            <AiModalContentContainer gap={1} minHeight={skeletonHeight ?? 0}>
              {errorMessage && (
                <Typography color="error">{errorMessage}</Typography>
              )}
              {loading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={skeletonHeight}
                />
              ) : (
                children
              )}
            </AiModalContentContainer>
          </Stack>
          <AiModalFooterContainer
            direction="row"
            justifyContent="flex-end"
            gap={0.5}
          >
            {buttons}
          </AiModalFooterContainer>
        </Stack>
      </AiModalContainer>
    </StyledPopover>
  );
}

const AiModalContentContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1, 2.5, 2.5),
}));

const AiModalFooterContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  position: "sticky",
  bottom: 0,
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));
