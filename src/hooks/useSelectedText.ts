import { getCursorXY } from "@src/utils/getCurserXY";
import { useState, useEffect, useRef } from "react";

export function useSelectedText() {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectedTextPositions, setSelectedTextPositions] = useState<{
    transform: string;
    position: "absolute";
  } | null>(null);
  const [textType, setTextType] = useState<"input" | "default" | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updatePosition = (top: number, left: number) => {
      setSelectedTextPositions({
        position: "absolute",
        transform: `translate(${left}px, ${top}px)`,
      });
    };

    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        let top = 0;
        let left = 0;
        if (
          document.activeElement?.tagName === "TEXTAREA" ||
          document.activeElement?.tagName === "INPUT"
        ) {
          // textarea or input element
          const activeElement = document.activeElement as
            | HTMLInputElement
            | HTMLTextAreaElement;
          const cursorXY = getCursorXY(
            activeElement as HTMLInputElement | HTMLTextAreaElement,
            activeElement.selectionEnd!
          );
          const inputOffsetTop = getOffsetTop(activeElement);
          const inputOffsetLeft = getOffsetLeft(activeElement);
          top = cursorXY.y + inputOffsetTop;
          left = cursorXY.x + inputOffsetLeft;
          setTextType("input");
        }
        if (document.activeElement) {
          if (document.activeElement.hasAttribute("contenteditable")) {
            setTextType("input");
          } else {
            setTextType("default");
          }
          const range = selection.getRangeAt(0);
          // const rect = range.getBoundingClientRect();
          const rects = range.getClientRects();
          const rect = rects[rects.length - 1];
          top = rect.top + rect.height + window.scrollY + 3;
          left = rect.left + rect.width + window.scrollX + 3;
        }
        if (top && left) {
          // if top and left are out of current view then set to bottom right
          if (
            top > window.innerHeight + window.scrollY ||
            left > window.innerWidth + window.scrollX
          ) {
            top = window.scrollY + window.innerHeight - 100;
            left = window.scrollX + window.innerWidth - 100;
          }
          setSelectedText(selection.toString());
          updatePosition(top, left);
        }
      } else {
        setSelectedText(null);
      }
    };

    const handleEvent = (e: Event) => {
      if (typeof timeoutRef.current === "number")
        clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        handleSelection();
      }, 100);
    };

    const handleKeyup = (e: KeyboardEvent) => {
      if (typeof timeoutRef.current === "number")
        clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        handleSelection();
      }, 100);
    };

    document.addEventListener("mouseup", handleEvent);
    document.addEventListener("keyup", handleKeyup);

    return () => {
      document.removeEventListener("mouseup", handleEvent);
      document.removeEventListener("keyup", handleKeyup);
    };
  }, []);

  function updateSelectedText(value: string) {
    if (!selectedText) return;

    const selection = window.getSelection();
    if (selection) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(value));
      setSelectedText(value);
    }
  }

  return { selectedText, updateSelectedText, selectedTextPositions, textType };
}

function getOffsetTop(element: HTMLElement | null): number {
  return element
    ? element.offsetTop + getOffsetTop(element.offsetParent as HTMLElement)
    : 0;
}
function getOffsetLeft(element: HTMLElement | null): number {
  return element
    ? element.offsetLeft + getOffsetLeft(element.offsetParent as HTMLElement)
    : 0;
}
