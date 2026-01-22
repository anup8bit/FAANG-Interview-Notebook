import { useEffect } from "react";

export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  active: boolean
) {
  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    // Get all focusable elements inside the modal
    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "[tabindex]:not([tabindex='-1'])"
    ];

    const focusableElements = Array.from(
      container.querySelectorAll(focusableSelectors.join(","))
    ) as HTMLElement[];

    if (focusableElements.length === 0) return;

    let first = focusableElements[0];
    let last = focusableElements[focusableElements.length - 1];

    // Auto focus first element when modal opens
    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      // SHIFT + TAB (reverse)
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      }
      // TAB (forward)
      else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };

  }, [containerRef, active]);
}
