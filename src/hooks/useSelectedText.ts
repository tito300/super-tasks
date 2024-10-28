import { useState, useEffect } from "react";

export function useSelectedText() {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectedTextPositions, setSelectedTextPositions] = useState<{
    transform: string;
    position: "absolute";
  } | null>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getClientRects();

        const top = rect[rect.length - 1]?.top;
        const left = rect[rect.length - 1]?.left;

        if (top && left) {
          setSelectedText(selection.toString());
          setSelectedTextPositions({
            position: "absolute",
            transform: `translate(${window.scrollX + left}px, ${
              window.scrollY + top + 27
            }px)`,
          });
        }
      } else {
        setSelectedText(null);
      }
    };

    document.addEventListener("mouseup", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
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

  return { selectedText, updateSelectedText, selectedTextPositions };
}
