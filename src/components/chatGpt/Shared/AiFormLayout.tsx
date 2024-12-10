import { Divider, IconButton, PaperProps, Typography } from "@mui/material";
import { Stack } from "@mui/material";
import { Skeleton } from "@mui/material";
import { styled } from "@mui/material";
import { Paper } from "@mui/material";
import { Box } from "@mui/material";
import { Button } from "@mui/material";
import { ChevronLeft, Close } from "@mui/icons-material";
import React from "react";
import { constants } from "@src/config/constants";
import { Alert } from "@mui/material";

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
    disableFooterBackButton?: boolean;
    buttons?: React.ReactNode;
    hidden?: boolean;
    footer?: React.ReactNode;
    headerButtons?: React.ReactNode;
    contentContainerRef?: React.RefObject<HTMLDivElement>;
    limitReached?: boolean;
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
    disableFooterBackButton,
    limitReached,
    onClose,
    ...rest
  },
  ref
) {
  const hasFooter =
    (!disableFooterBackButton && onBackClick) || buttons || onRetryClick;
  return (
    <AiModalContainer ref={ref} elevation={3} hidden={hidden} {...rest}>
      <HeaderContainer
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {onBackClick && (
          <IconButton size="small" onClick={onBackClick} sx={{ mx: 1 }}>
            <ChevronLeft />
          </IconButton>
        )}
        <Typography
          variant="h6"
          sx={{
            textTransform: "none",
            px: (theme) => theme.spacing(2.5),
            py: (theme) => theme.spacing(1),
            my: 0,
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
          }}
        >
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
            <>
              {errorMessage && (
                <Typography px={AiFormLayoutPaddings.pxValue} color="error">
                  {errorMessage}
                </Typography>
              )}
              {/* // prettier-ignore */}
              {children}
              {limitReached && (
                <Alert severity="warning">
                  Daily limit is reached on premium models. Results will be
                  generated using the free model. We’ll offer upgrade options in
                  the future. Thanks for being an early Axess user!
                </Alert>
              )}
            </>
          )}
        </AiModalContentContainer>
        {hasFooter && (
          <AiModalFooterContainer
            direction="row"
            justifyContent="flex-end"
            gap={0.5}
          >
            {onBackClick && !disableFooterBackButton && (
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

const AiModalContentContainer = styled("div")(({ theme }) => ({
  height: "100%",
  overflow: "auto",
}));

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
      borderRadius: "4px",
      overflow: "hidden",
    } as const)
);

const HeaderContainer = styled(Stack)(({ theme }) => ({
  backgroundColor: "#eee8c8",
  position: "sticky",
  top: 0,
  zIndex: 1,
  boxShadow: "1px 0px 4px #00000036",
}));
