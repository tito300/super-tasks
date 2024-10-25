/**
 * This hook is used to grab text or wysiwyg inputs from the user
 * when they are typing. It debounces the input to prevent too many
 * requests from being made to the server. wysiwyg inputs are normally
 * nested within a div with contenteditable="true" attribute.
 */

import { useEffect, useState } from "react";

export const useUserTypingInput = () => {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [typingInput, setTypingInput] = useState<string>("");

  useEffect(() => {
    const listener = (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") {
        setTypingInput(target.value || "");
        setContainer(target);
      } else if (target.contentEditable === "true") {
        setTypingInput(target.innerHTML || "");
        setContainer(target as HTMLElement);
      }
    };

    document.addEventListener("input", listener);

    return () => {
      document.removeEventListener("input", listener);
    };
  }, []);

  const updateInput = (value: string) => {
    if (!container) return;

    container.innerHTML = value;
  };

  return {
    container,
    updateInput,
    typingInput,
  };
};

function debounce(fn: Function, delay: number) {
  let timeoutId: NodeJS.Timeout;

  return function (...args: any) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
