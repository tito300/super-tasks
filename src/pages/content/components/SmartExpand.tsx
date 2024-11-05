import { IconButton } from "@mui/material";
import { styled, SxProps } from "@mui/material";
import { Position } from "postcss";
import { useState, useEffect, useRef, CSSProperties } from "react";
import { theme } from "webextension-polyfill";
import { BadgeStyled } from "./DockStationContainer";
import { constants } from "@src/config/constants";

type PagePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type SmartExpandProps = {
  elements: JSX.Element[];
  pagePosition: PagePosition;
  primaryElement: JSX.Element;
  dragging: boolean;
  badgeContent?: JSX.Element;
  elementSize: number; // px
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
  const { elements, primaryElement, badgeContent } = props;
  return (
    <Container ownerProps={props}>
      <ElementContainer data-smart-expand-primary ownerState={props}>
        {primaryElement}
      </ElementContainer>
      {elements.map((element, index) => {
        if (!index && props.badgeContent) {
          return (
            <ElementContainer
              opacity={0}
              data-smart-expand-index={index}
              ownerState={props}
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
            opacity={0}
            data-smart-expand-index={index}
            ownerState={props}
          >
            {element}
          </ElementContainer>
        );
      })}
    </Container>
  );
}

const Container = styled("div")<{ ownerProps: SmartExpandProps }>(
  ({ ownerProps, theme }) => {
    const { elements, pagePosition, primaryElement, dragging, elementSize } =
      ownerProps;
    return {
      width: elementSize,
      height: elementSize,
      position: "relative",
      "&:hover [data-smart-expand-primary]": {
        transform: "scale(1)",
      },
      ...(dragging
        ? null
        : {
            "&:hover": {
              height: getButtonsExpandedSize(elements.length, elementSize),
              width: getButtonsExpandedSize(elements.length, elementSize),
              [" [data-smart-expand-primary]"]: {
                opacity: 0,
              },
              [" [data-smart-expand-index='0']"]: {
                transform: getElementTransform(pagePosition, 0),
                transition: "transform 0.1s",
                opacity: 1,
              },
              [" [data-smart-expand-index='1']"]: {
                transform: getElementTransform(pagePosition, 1),
                transition: "transform 0.1s",
                opacity: 1,
              },
              [" [data-smart-expand-index='2']"]: {
                transform: getElementTransform(pagePosition, 2),
                transition: "transform 0.1s",
                opacity: 1,
              },
            },
          }),
    };
  }
);

function getButtonsExpandedSize(elementsCount: number, elementSize: number) {
  if (elementsCount === 1) {
    return elementSize;
  } else if (elementsCount === 2 || elementsCount === 3) {
    return elementSize * 2;
  }
}

const ElementContainer = styled("div")<{
  ownerState: SmartExpandProps;
  opacity?: CSSProperties["opacity"];
}>(({ ownerState, opacity }) => ({
  position: "absolute",
  width: ownerState.elementSize,
  height: ownerState.elementSize,
  backgroundColor: "transparent",
  transform: "scale(0.6)",
  ...(opacity != null && { opacity }),
  ...getElementStartingPositions(ownerState.pagePosition),
}));

function getElementStartingPositions(pagePosition: PagePosition) {
  return {
    bottom: 0,
    right: 0,
  };
}

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
