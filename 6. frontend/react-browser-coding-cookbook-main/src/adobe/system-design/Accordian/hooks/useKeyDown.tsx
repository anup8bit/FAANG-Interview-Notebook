import { useEffect } from "react"


const useKeyDown = (
  key: string,
  handler: () => void,
) => {
  useEffect(() => {
    const focusableElements = [
      'button',
      'tab',
      'textbox', 'textarea', 'checkbox', 'form',

    ]
    // const elements = document.querySelectorAll();
  }, [key]);
}