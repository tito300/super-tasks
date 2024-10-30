import { getCursorXY } from "@src/utils/getCurserXY";
import { useState, useEffect } from "react";

export function useSelectedText() {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectedTextPositions, setSelectedTextPositions] = useState<{
    transform: string;
    position: "absolute";
  } | null>(null);
  const [textType, setTextType] = useState<"input" | "default" | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleEvent = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
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
          } else {
            if (document.activeElement?.hasAttribute("contenteditable")) {
              setTextType("input");
            } else {
              setTextType("default");
            }

            const range = selection.getRangeAt(0);
            // const rect = range.getBoundingClientRect();
            const rects = range.getClientRects();
            const rect = rects[rects.length - 1];

            top = rect.top + rect.height + window.scrollY + 6;
            left = rect.left + rect.width + window.scrollX + 6;
          }

          if (top && left) {
            setSelectedText(selection.toString());
            setSelectedTextPositions({
              position: "absolute",
              transform: `translate(${left}px, ${top}px)`,
            });
          }
        } else {
          setSelectedText(null);
        }
      }, 10);
    };

    document.addEventListener("mouseup", handleEvent);
    // document.addEventListener("click", handleEvent);

    return () => {
      document.removeEventListener("mouseup", handleEvent);
      // document.removeEventListener("click", handleEvent);
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
