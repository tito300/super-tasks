/**
 * This hook is used to grab text or wysiwyg inputs from the user
 * when they are typing. It debounces the input to prevent too many
 * requests from being made to the server. wysiwyg inputs are normally
 * nested within a div with contenteditable="true" attribute.
 */

import { useEffect, useState } from "react";

const ignoredInputTypes = ["file", "checkbox", "radio", "submit", "button"];

export const useUserTypingInput = () => {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [typingInput, setTypingInput] = useState<string>("");

  useEffect(() => {
    const handleInput = (target: HTMLInputElement | HTMLTextAreaElement) => {
      if (ignoredInputTypes.includes(target.type)) return;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") {
        setTypingInput(target.value || "");
        setContainer(target);
      } else {
        const contentEditable = getCloseContentEditableParent(target);
        if (contentEditable) {
          setTypingInput(contentEditable.innerText || "");
          setContainer(contentEditable as HTMLElement);
        }
      }
    };
    const listener = (event: Event) => {
      if (shouldIgnoreInput()) return;

      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      handleInput(target);
    };

    document.addEventListener("input", listener);
    document.addEventListener("click", listener);
    document.addEventListener("focus", listener);

    setTimeout(() => {
      if (document.activeElement) {
        const activeElement = document.activeElement as HTMLElement;
        if (
          isInputElement(activeElement) ||
          getCloseContentEditableParent(activeElement)
        ) {
          handleInput(activeElement as HTMLInputElement | HTMLTextAreaElement);
        }
      }
    }, 1000);

    onInputInserted((input) => {
      handleInput(input);
    });

    return () => {
      document.removeEventListener("input", listener);
      document.removeEventListener("click", listener);
      document.removeEventListener("focus", listener);
    };
  }, []);

  const updateInput = (value: string) => {
    if (!container) return;

    if (container.tagName === "INPUT" || container.tagName === "TEXTAREA") {
      // use input event to set value for input and textarea elements. This will trigger controlled
      // elements default behaivor
      const event = new Event("input", { bubbles: true });
      const target = container as HTMLInputElement | HTMLTextAreaElement;
      target.value = value;
      target.dispatchEvent(event);
    } else if (container.contentEditable === "true") {
      container.innerHTML = value;
    }
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

function shouldIgnoreInput() {
  if (passwordElement()) return true;

  // google search page
  if (document.location.href === "https://www.google.com/") return true;
  if (document.location.href.includes("https://www.google.com/search"))
    return true;
}

function passwordElement() {
  const activeElement = document.activeElement as HTMLInputElement;
  return activeElement.tagName === "INPUT" && activeElement.type === "password";
}

function isInputElement(target: HTMLElement) {
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA";
}

function getCloseContentEditableParent(target: HTMLElement) {
  if (target.contentEditable === "true") return target;

  if (!target.parentElement) return false;
  if (target.parentElement.contentEditable === "true")
    return target.parentElement;
  return getCloseContentEditableParent(target.parentElement);
}

// detect when a text input has been inserted to dom
function onInputInserted(
  callback: (input: HTMLInputElement | HTMLTextAreaElement) => void
) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (
          node instanceof HTMLInputElement ||
          node instanceof HTMLTextAreaElement
        ) {
          callback(node);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
