import { useEffect, useState } from "react";

/**
 * detects if a given element covers text within another element
 */
export function usePositionedOverText(
  topElement: HTMLElement,
  textContainer: HTMLElement,
  dependencies: any[]
) {
  const [isCoveringText, setIsCoveringText] = useState(false);

  useEffect(() => {
    const topElementRect = topElement.getBoundingClientRect();

    // inspect of top element rect is covering text within the text container
    // if the top element is not covering text and only empty state, set isCoveringText to false
    const textContainerRect = textContainer.getBoundingClientRect();
  }, [...dependencies]);

  return isCoveringText;
}
