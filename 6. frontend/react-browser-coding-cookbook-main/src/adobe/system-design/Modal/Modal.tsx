import { ModalProps } from "./type";
import "./modal.css";
import { useRef } from "react";
import { useOnClickOutside } from "./hook/useOnClickOutside";
import { createPortal } from "react-dom";
import { useOnKeyPress } from "./hook/useOnKeyPress";
import { useFocusTrap } from "./hook/useFocusTrap";

/**
 * 
 *  @Portal to document.body to Prevents z-index and stacking issues.
 * @Focus_trap Required for accessibility (WCAG).
 * @Body_Scroll_Lock Prevents background scroll when modal is open
 */

const Modal = ({
  open,
  toggleModal,
  title,
  content,
  footer,
  id,
  testId,
  className,
  closeOnBackDropClick
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  console.log("open : ", open);  
  useOnClickOutside(modalRef, () => {
    if(closeOnBackDropClick) {
      toggleModal();
    }
  });

  /**
   * When your modal is open, you want the ESC key to work → active = true
   * When your modal is closed, ESC should do nothing → active = false
   */

  useOnKeyPress('Escape', () => toggleModal(), open);

  useFocusTrap(modalRef, open);

  if (!open) return null;

  return createPortal(
    <div className="modal-backdrop">
      <div className="modal" ref={modalRef}>
        <div className="modal-container">
          {content}
        </div>
      </div>
    </div>, document.body
  )
}

export default Modal;
