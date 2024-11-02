import { Divider, IconButton, PaperProps, Typography } from "@mui/material";
import { Stack } from "@mui/material";
import { Skeleton } from "@mui/material";
import { styled } from "@mui/material";
import { Paper } from "@mui/material";
import { Box } from "@mui/material";
import { Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import React from "react";
import { constants } from "@src/config/constants";

type falsyValue = false | null | undefined;
export const AiFormLayout = React.forwardRef<
  HTMLDivElement,
  {
    title: string;
    onClose: () => void;
    skeletonHeight?: number;
    errorMessage?: string | null;
    loading?: boolean;
    onBackClick?: (() => void) | falsyValue; // allows for booleanCondition && function syntax
    onRetryClick?: (() => void) | falsyValue;
    buttons?: React.ReactNode;
    hidden?: boolean;
    footer?: React.ReactNode;
    headerButtons?: React.ReactNode;
    contentContainerRef?: React.RefObject<HTMLDivElement>;
  } & PaperProps
>(function _AiFormLayout(
  {
    title,
    skeletonHeight,
    errorMessage,
    loading,
    children,
    buttons,
    onBackClick,
    onRetryClick,
    hidden,
    footer,
    headerButtons,
    contentContainerRef,
    onClose,
    ...rest
  },
  ref
) {
  const hasButtons = onBackClick || buttons || onRetryClick;
  return (
    <AiModalContainer ref={ref} elevation={4} hidden={hidden} {...rest}>
      <HeaderContainer
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          variant="h6"
          sx={{
            textTransform: "none",
            px: (theme) => theme.spacing(2.5),
            py: (theme) => theme.spacing(1),
          }}
        >
          {title}
        </Typography>
        <Stack direction="row" alignItems="center" gap={0.25} px={1}>
          {headerButtons}
          <IconButton size="small" onClick={onClose}>
            <Close fontSize="small" />
          </IconButton>
        </Stack>
      </HeaderContainer>
      <Stack height="100%" flexGrow={1} overflow={"hidden"}>
        <AiModalContentContainer
          id={`${constants.EXTENSION_NAME}-modal-content-container`}
          sx={{
            minHeight: skeletonHeight ?? 0,
            height: "100%",
            overflow: "auto",
          }}
        >
          {errorMessage && (
            <Typography px={AiFormLayoutPaddings.pxValue} color="error">
              {errorMessage}
            </Typography>
          )}
          {loading ? (
            <Box
              px={AiFormLayoutPaddings.pxValue}
              py={AiFormLayoutPaddings.pyValue}
            >
              <Skeleton
                variant="rectangular"
                width="100%"
                height={skeletonHeight}
              />
            </Box>
          ) : (
            // prettier-ignore
            children
          )}
        </AiModalContentContainer>
        {hasButtons && (
          <AiModalFooterContainer
            direction="row"
            justifyContent="flex-end"
            gap={0.5}
          >
            {onBackClick && (
              <Button
                disabled={loading}
                variant="text"
                color="primary"
                size="small"
                onClick={onBackClick}
              >
                Back
              </Button>
            )}
            {buttons}
            {onRetryClick && (
              <Button
                disabled={loading}
                variant="contained"
                size="small"
                color="info"
                onClick={onRetryClick}
              >
                Retry
              </Button>
            )}

            {/* <Button variant="outlined" size="small" onClick={onClose}>
            Close
          </Button> */}
          </AiModalFooterContainer>
        )}
        {footer && <AiModalContainer>{footer}</AiModalContainer>}
      </Stack>
    </AiModalContainer>
  );
});

export const AiFormLayoutPaddings = {
  pxValue: 2,
  pyValue: 2,
};

const AiModalContentContainer = styled("div")(({ theme }) => ({}));

const AiModalFooterContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  position: "sticky",
  bottom: 0,
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const AiModalContainer = styled(Paper)<{ hidden?: boolean }>(
  ({ hidden }) =>
    ({
      width: "400px",
      maxHeight: "450px",
      display: hidden ? "none" : "flex",
      flexDirection: "column",
      // overflowY: "auto",
      // overflowX: "clip",
    } as const)
);

const HeaderContainer = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  position: "sticky",
  top: 0,
  zIndex: 1,
  boxShadow: "1px 0px 4px #00000036",
}));
