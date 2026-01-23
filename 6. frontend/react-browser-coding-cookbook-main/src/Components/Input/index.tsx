
import { ChangeEvent, FormEvent, ReactElement } from "react";
import "./input.css";

interface InputProps {
  className?: string;
  id?: string;
  onChange: (e: FormEvent<HTMLInputElement>) => void;
  label?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  testId?: string;
  type?: HTMLInputElement["type"],
  value: string | number,
}

const Input = ({
  className,
  id,
  onChange,
  label,
  name,
  placeholder,
  required,
  testId,
  type = "text",
  value,
}: InputProps): ReactElement | null => {
  const handleOnChange = () => {}

  return (
    <div className="input-container">
      <label>{label}</label>
      <div>
        <input
          className="input-field"
          value={value}
          type={type}
          placeholder={placeholder}
          name={name}
          id={id}
          onChange={onChange}
          data-testId={testId}
          required={required}
          aria-required={true}
        />
      </div>
    </div>
  )
}

export default Input;