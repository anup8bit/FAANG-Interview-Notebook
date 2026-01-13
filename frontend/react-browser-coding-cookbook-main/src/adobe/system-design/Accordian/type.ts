import { ReactNode } from "react";

export interface AccordianProps {
  title: ReactNode;
  content: ReactNode;
  key?: string;
  id?: string;
  active?: boolean;
  isMultiOpen?: boolean;
  setActiveIndex?: () => void;
}

export interface HeaderProps {
  title: ReactNode;
  open: boolean;
  toggle: () => void;
  ariaControl?: string | undefined;
  setActiveIndex?: () => void;
}

export interface AccordianPanelProps {
  content: ReactNode;
  open: boolean;
}

