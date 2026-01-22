import { ChangeEvent, ReactElement, ReactNode } from "react";

interface InputProps {
  className?: string;
  id?: string;
  testId?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: InputEvent) => void;
  label?: ReactNode;
}


const Input = ({
  className,
  id,
  testId,
  name,
  value,
  onChange,
  placeholder,
  label,
}: InputProps): ReactElement | null => {
  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        className={className}
        id={id}
        name={name}
        value={value}
        data-testid={testId}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}

export default Input;