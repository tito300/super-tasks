import { styled } from "@mui/material";
import { useState, useLayoutEffect } from "react";
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
};

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
  const { elements, badgeContent } = props;
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
    <Container id={`axess-smart-container`} ownerProps={ownerState}>
      <ElementContainer
        data-smart-expand-primary
        ownerState={ownerState}
        primary
      ></ElementContainer>
      {elements.map((element, index) => {
        if (!index && props.badgeContent) {
          return (
            <ElementContainer
              data-smart-expand-index={index}
              ownerState={ownerState}
            >
              <BadgeStyled
                slotProps={{
                  badge: {
                    id: `${constants.EXTENSION_NAME}-remove-button`,
                  },
                }}
                anchorOrigin={{ ...getBadgeAnchorOrigin(props.pagePosition) }}
                color="default"
                badgeContent={badgeContent}
              >
                {element}
              </BadgeStyled>
            </ElementContainer>
          );
        }

        return (
          <ElementContainer
            data-smart-expand-index={index}
            ownerState={ownerState}
          >
            {element}
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
              width: 18, // width of the container is bigger than actual colored element width to give user more space to hover
              height: 60, // height of the container is bigger than actual colored element height to give user more space to hover
            }),
            "&:hover": {
              height: getButtonsExpandedSize(elements.length, elementSize),
              width: getButtonsExpandedSize(elements.length, elementSize),
              ...(snap && {
                transform: "translate(0, -40px)",
                pointerEvents: "auto",
              }),
              [" [data-smart-expand-primary]"]: {
                opacity: 0,
              },
              [" [data-smart-expand-index='0']"]: {
                transform: getElementTransform(pagePosition, 0),
                transition: "transform 0.1s",
                opacity: 1,
                pointerEvents: "auto",
              },
              [" [data-smart-expand-index='1']"]: {
                transform: getElementTransform(pagePosition, 1),
                transition: "transform 0.1s",
                opacity: 1,
                pointerEvents: "auto",
              },
              [" [data-smart-expand-index='2']"]: {
                transform: getElementTransform(pagePosition, 2),
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
  position: "absolute",
  cursor: "pointer",
  // @ts-ignore
  width: ownerState.elementSize,
  // @ts-ignore
  height: ownerState.elementSize,
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
      width: 5,
      height: 26,
      backgroundColor: "#ff9f20",
      background: "linear-gradient(to bottom, #e78300, #ffbd89)",
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
      pointerEvents: "auto",
      background: "linear-gradient(45deg, #dc8300, #ffb834)",
      borderRadius: "50%",
      "& *": {
        opacity: 0,
      },
    }),
}));

function getElementTransform(pagePosition: PagePosition, index: number) {
  if (index === 0) return "translate(0, 0)";
  if (pagePosition === "top-right") {
    if (index === 1) {
      return "translate(0, 100%)";
    } else if (index === 2) {
      return "translate(-100%, 0)";
    }
  }

  if (pagePosition === "top-left") {
    if (index === 1) {
      return "translate(0, 100%)";
    } else if (index === 2) {
      return "translate(100%, 0)";
    }
  }

  if (pagePosition === "bottom-right") {
    if (index === 1) {
      return "translate(0, -100%)";
    } else if (index === 2) {
      return "translate(-100%, 0)";
    }
  }

  if (pagePosition === "bottom-left") {
    if (index === 1) {
      return "translate(0, -100%)";
    } else if (index === 2) {
      return "translate(100%, 0)";
    }
  }
}

function getBadgeAnchorOrigin(pagePosition: PagePosition) {
  if (pagePosition === "top-right") {
    return {
      vertical: "top",
      horizontal: "right",
    } as const;
  }

  if (pagePosition === "top-left") {
    return {
      vertical: "top",
      horizontal: "left",
    } as const;
  }

  if (pagePosition === "bottom-left") {
    return {
      vertical: "bottom",
      horizontal: "left",
    } as const;
  }

  return {
    vertical: "bottom",
    horizontal: "right",
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
