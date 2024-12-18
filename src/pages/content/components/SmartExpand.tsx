import { styled } from "@mui/material";
import React, { useState, useLayoutEffect } from "react";
import { BadgeStyled } from "./DockStationContainer";
import { constants } from "@src/config/constants";
import { useUserState } from "@src/components/Providers/UserStateProvider";
import { shouldSnap, useDraggableContext } from "@src/components/Draggable";

type PagePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type SmartExpandProps = {
  elements: JSX.Element[];
  pagePosition: PagePosition;
  badgeContent?: JSX.Element;
  elementSize: number; // px
} & React.HTMLAttributes<HTMLDivElement>;

type OwnerState = SmartExpandProps & {
  snap: boolean;
  dataSyncing: boolean;
  snapDirection: "left" | "right" | null;
  isDragging: boolean;
};

/**
 * Takes a list of elements and overlays under primary element
 * then on hover and based on pagePosition, it will expand them in the right direction and then
 * hides the primary element.
 *
 * It also knows where to move each element based on how many there are.
 *
 * Example 1: Assume there are two elements passed and pagePosition is top-right.
 * It will expand the first element to the left and second element to bottom.
 *
 * Example 2: Assume there are three elements passed and pagePosition is top-right
 * It will expand the first element to the left, second element to bottom and
 * third element to bottom left.
 *
 * styled component CSS transform is used to move the elements around.
 */
export function SmartExpand(props: SmartExpandProps) {
  const { elements, badgeContent, pagePosition, ...rest } = props;
  const { dataSyncing } = useUserState();
  const { snapped, snapDirection, isDragging } = useDraggableContext();

  const ownerState = {
    ...props,
    dataSyncing,
    snap: snapped,
    snapDirection,
    isDragging,
  };

  return (
    <Container id={`axess-smart-container`} ownerProps={ownerState} {...rest}>
      {/* <BadgeStyled
        slotProps={{
          badge: {
            id: `${constants.EXTENSION_NAME}-remove-button`,
          },
        }}
        anchorOrigin={{ ...getBadgeAnchorOrigin(pagePosition) }}
        color="default"
        badgeContent={badgeContent}
      > */}
      <ElementContainer
        data-smart-expand-primary
        ownerState={ownerState}
        primary
      ></ElementContainer>
      {/* </BadgeStyled> */}
      {elements.map((element, index) => {
        const elementClone = React.cloneElement(element, {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            element.props.onClick?.(e);
          },
        });

        // if (!index && badgeContent) {
        //   return (
        //     <ElementContainer
        //       data-smart-expand-index={index}
        //       ownerState={ownerState}
        //     >

        //     </ElementContainer>
        //   );
        // }

        return (
          <ElementContainer
            data-smart-expand-index={index}
            ownerState={ownerState}
          >
            {elementClone}
          </ElementContainer>
        );
      })}
    </Container>
  );
}

const Container = styled("div")<{ ownerProps: OwnerState }>(
  ({ ownerProps }) => {
    const {
      elements,
      pagePosition,
      isDragging,
      elementSize,
      snap,
      dataSyncing,
    } = ownerProps;

    return {
      display: dataSyncing ? "none" : "block",
      width: elementSize,
      height: elementSize,
      position: "relative",
      backgroundColor: "transparent",
      cursor: "grab",
      ...(isDragging
        ? {}
        : {
            ...(snap && {
              width: 32, // width of the container is bigger than actual colored element width to give user more space to hover
              height: 68, // height of the container is bigger than actual colored element height to give user more space to hover
            }),
            "&:hover": {
              position: "absolute",
              display: "flex",
              gap: "8px",
              flexDirection: "column",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              height: "auto",
              ...(snap && {
                pointerEvents: "auto",
                paddingRight: "54px",
              }),
              [" [data-smart-expand-primary]"]: {
                opacity: 0,
              },
              [" [data-smart-expand-index='0']"]: {
                transform: "scale(1)",
                transition: "transform 0.1s",
                opacity: 1,
                pointerEvents: "auto",
              },
              [" [data-smart-expand-index='1']"]: {
                transform: "scale(1)",
                transition: "transform 0.1s",
                opacity: 1,
                pointerEvents: "auto",
              },
              [" [data-smart-expand-index='2']"]: {
                transform: "scale(1)",
                transition: "transform 0.1s",
                opacity: 1,
                pointerEvents: "auto",
              },
              [" [data-smart-expand-index='3']"]: {
                transform: "scale(1)",
                transition: "transform 0.1s",
                opacity: 1,
                pointerEvents: "auto",
              },
            },
          }),
    };
  }
);

function getButtonsExpandedSize(elementsCount: number, elementSize: number) {
  if (elementsCount === 1) {
    return elementSize * 1.2;
  } else if (elementsCount === 2 || elementsCount === 3) {
    return elementSize * 2.2;
  }
}

const ElementContainer = styled("div")<{
  ownerState: OwnerState;
  primary?: boolean;
}>(({ ownerState, primary }) => ({
  cursor: "pointer",
  // @ts-ignore
  backgroundColor: "transparent",
  // @ts-ignore
  pointerEvents: "none",
  opacity: 0,
  transform: "scale(0.15)",
  bottom: 0,
  // @ts-ignore
  right: 0,
  ...(ownerState.snap && ownerState.snapDirection === "left" && { left: 0 }),
  ...(primary &&
    ownerState.snap && {
      position: "absolute",
      width: 6,
      height: 26,
      backgroundColor: "#ff9f20",
      background: "linear-gradient(to bottom, #c57000, #ff7c15)",
      pointerEvents: "auto",
      opacity: 1,
      transform: "translateY(-50%)",
      top: "50%",
      "& *": {
        opacity: 0,
      },
      ...(ownerState.snapDirection === "right"
        ? {
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
            right: 0,
            borderLeft: "1px solid #ff9f20",
          }
        : {
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
            left: 0,
            borderRight: "1px solid #ff9f20",
          }),
    }),
  ...(primary &&
    !ownerState.snap && {
      opacity: 1,
      width: 44,
      height: 44,
      pointerEvents: "auto",
      background: "linear-gradient(45deg, #dc8300, #ffb834)",
      borderRadius: "50%",
      "& *": {
        opacity: 0,
      },
    }),
}));

function getBadgeAnchorOrigin(pagePosition: PagePosition) {
  if (pagePosition === "top-right") {
    return {
      vertical: "top",
      horizontal: "left",
    } as const;
  }

  if (pagePosition === "top-left") {
    return {
      vertical: "top",
      horizontal: "right",
    } as const;
  }

  if (pagePosition === "bottom-left") {
    return {
      vertical: "bottom",
      horizontal: "right",
    } as const;
  }

  return {
    vertical: "bottom",
    horizontal: "left",
  } as const;
}

export function useSnapDockStation() {
  const [snap, setSnap] = useState(false);
  const { data: userState } = useUserState();

  useLayoutEffect(() => {
    const percentageFromLeft = userState?.position?.percentageFromLeft;
    const percentageFromTop = userState?.position?.percentageFromTop;

    if (shouldSnap(percentageFromLeft, percentageFromTop)) {
      setSnap(true);
    } else {
      setSnap(false);
    }
  }, [
    userState?.position?.percentageFromLeft,
    userState?.position?.percentageFromTop,
  ]);

  return snap;
}
