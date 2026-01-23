import { ChangeEvent } from "react";

export interface FileInputProps {
  label?: string;
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  id: string;
  className?: string;
  multiple?: boolean;
}