import { ReactNode } from "react"

export interface ModalProps {
  open: boolean;
  toggleModal: () => void;
  title?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  testId?: string;
  id?: string;
  className?: string;
  closeOnBackDropClick?: boolean;
}

export interface ModalBodyProps {

}