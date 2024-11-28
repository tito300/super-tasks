import { useSelectedText } from "@src/hooks/useSelectedText";
import { useUserTypingInput } from "@src/hooks/useUserTypingInput";
import { useState, useRef, ComponentProps, useEffect } from "react";
import { StyledPopover } from "../shared/StyledPopover";
import { StyledPopper } from "../shared/StyledPopper";
import {
  AiOption,
  AiTooltipButtons,
  improvements,
  Tone,
  ToneChip,
} from "./AiSelectedText";
import { Button, Stack, Divider, Alert, AlertTitle } from "@mui/material";
import { retryAsync } from "@src/utils/retryAsync";
import { constants } from "@src/config/constants";
import { LlmModel } from "../Providers/ChatGptStateProvider";
import { useServicesContext } from "../Providers/ServicesProvider";
import { CodeMarkdown } from "../shared/CodeMarkdown";
import { AiFormLayout, AiFormLayoutPaddings } from "./Shared/AiFormLayout";
import { ChatActionChip } from "./ChatGpt";

export function AiRewriteActions() {
  const [hideIcon, setHideIcon] = useState(false);
  const [openRewriteModal, setOpenRewriteModal] = useState(false);
  const { typingInput, updateInput, container } = useUserTypingInput();
  const { selectedText } = useSelectedText();
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleOpenModal = () => {
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
  const topOffset = -32 - (parseInt(containerStyles.paddingTop) || 0);
  const rightOffset = -(parseInt(containerStyles.paddingRight) || 0);

  return (
    <>
      <StyledPopper
        open
        anchorEl={document.body}
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
        <AiTooltipButtons
          ref={tooltipRef}
          expandDirection="left"
          onOpen={handleOpenModal}
          handleRemoveIcon={handleRemoveIcon}
        />
      </StyledPopper>
      <StyledPopover
        open={openRewriteModal}
        anchorEl={container}
        disableScrollLock
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <AiReWriteForm
          input={typingInput}
          updateInput={updateInput}
          onClose={handleClose}
        />
      </StyledPopover>
    </>
  );
}

function validRewriteInput(input: string) {
  // at least 3 words
  if (!input.length) return false;

  return true;
}

export function AiReWriteForm(
  props: {
    input: string | null;
    updateInput: (input: string) => void;
    keepShort?: boolean;
    factCheck?: boolean;
  } & Omit<ComponentProps<typeof AiFormLayout>, "title">
) {
  const [selectedImprovements, setSelectedImprovements] = useState<Array<Tone>>(
    []
  );
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [inaccuracy, seInaccuracy] = useState<string | null>(null);
  const [hasInaccuracies, setHasInaccuracies] = useState(false);
  const { chatGpt } = useServicesContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiOptions, setAiOptions] = useState<{
    factCheck: boolean;
    keepShort: boolean;
    model: LlmModel["value"];
  }>({
    factCheck: props.keepShort || false,
    keepShort: props.factCheck || false,
    model: "gpt-4o",
  });
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const [skeletonHeight, setSkeletonHeight] = useState(150);
  const [tokenLimitReached, setTokenLimitReached] = useState(false);

  const { input, updateInput, onClose, onBackClick, ...rest } = props;

  useEffect(() => {
    if (
      contentContainerRef.current &&
      contentContainerRef.current.clientHeight
    ) {
      setSkeletonHeight(contentContainerRef.current.clientHeight);
    }
  }, [props.hidden]);

  useEffect(() => {
    setAiOptions((aiOptions) => ({
      ...aiOptions,
      ...(props.keepShort !== undefined && { keepShort: props.keepShort }),
      ...(props.factCheck !== undefined && { factCheck: props.factCheck }),
    }));
  }, [props.keepShort, props.factCheck]);

  const handleSubmit = () => {
    resetResults();
    setLoading(true);
    retryAsync(
      () =>
        chatGpt.suggestRewrite({
          improvements: selectedImprovements,
          input,
          checkInaccuracies: aiOptions.factCheck,
          keepShort: aiOptions.keepShort,
          model: aiOptions.model,
        }),
      3
    )
      .then((res) => {
        setSuggestion(res.message);
        seInaccuracy(res.inaccuracyMessage);
        setHasInaccuracies(!!res.hasInaccuracies);
        setTokenLimitReached(!!res.limitReached);
      })
      .catch((error) => {
        setError("Sorry, something went wrong.");
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
    navigator.clipboard.writeText(suggestion!);
    setSuggestion(null);
    onClose();
  };

  // const html = containsHtml(input);
  const showResults = !!suggestion || loading || hasInaccuracies;
  const showBackButton = showResults || onBackClick;

  const handleBackClick = () => {
    resetResults();
    if (!showResults && onBackClick) {
      onBackClick();
    }
  };

  const handleAiOptionClick = (option: keyof typeof aiOptions) => {
    setAiOptions((options) => ({ ...options, [option]: !options[option] }));
  };

  return (
    <AiFormLayout
      title={
        showResults
          ? "Rewrite Suggestion"
          : `${constants.EXTENSION_NAME_CAPITALIZED} Rewrite`
      }
      skeletonHeight={skeletonHeight}
      errorMessage={showResults ? error : ""}
      limitReached={tokenLimitReached}
      loading={loading}
      onClose={onClose}
      onBackClick={showBackButton && handleBackClick}
      onRetryClick={showResults && handleSubmit}
      buttons={
        <>
          {showResults && suggestion && (
            <Button
              variant="contained"
              size="small"
              disabled={loading}
              onClick={handleCopyClick}
            >
              Copy Text
            </Button>
          )}
          {!showResults && (
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={handleSubmit}
            >
              Run
            </Button>
          )}
        </>
      }
      {...rest}
    >
      {showResults ? (
        <>
          <Stack
            px={AiFormLayoutPaddings.pxValue}
            py={AiFormLayoutPaddings.pyValue}
            ref={contentContainerRef}
            gap={1}
          >
            <>
              <CodeMarkdown>{suggestion}</CodeMarkdown>
              {aiOptions.factCheck && inaccuracy && (
                <Alert
                  severity={hasInaccuracies ? "warning" : "info"}
                  sx={{ whiteSpace: "pre-line" }}
                >
                  <AlertTitle>Fact Check Result</AlertTitle>
                  {inaccuracy}
                </Alert>
              )}
            </>
          </Stack>
          <Stack
            px={AiFormLayoutPaddings.pxValue}
            py={1}
            direction="row"
            gap={0.5}
          >
            <ChatActionChip
              label={"Concise"}
              variant="outlined"
              selected={aiOptions.keepShort}
              onClick={() => handleAiOptionClick("keepShort")}
            />
            <ChatActionChip
              label="Fact Check"
              variant="outlined"
              selected={aiOptions.factCheck}
              onClick={() => handleAiOptionClick("factCheck")}
            />
          </Stack>
        </>
      ) : (
        <>
          <Stack
            px={AiFormLayoutPaddings.pxValue}
            py={AiFormLayoutPaddings.pyValue}
            ref={contentContainerRef}
            gap={1}
          >
            {/* <Typography lineHeight={1} variant="subtitle1">
            Select Improvements
          </Typography> */}
            <Stack gap={0.5} direction="row" flexWrap="wrap">
              {improvements.map((tone) => (
                <ToneChip
                  key={tone}
                  onClick={() => handleToneClick(tone)}
                  selected={selectedImprovements.includes(tone)}
                  variant={"outlined"}
                  label={tone}
                />
              ))}
            </Stack>
          </Stack>
        </>
      )}
    </AiFormLayout>
  );
}
