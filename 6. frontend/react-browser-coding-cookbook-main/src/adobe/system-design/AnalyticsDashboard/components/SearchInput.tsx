import { ChangeEvent } from "react";

interface SearchInputProps {
  placeholder?: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent) => void;
  label?: string;
  id: string;
}

const SearchInput = ({
  name,
  label,
  id,
  onChange,
  placeholder,
  value
}: SearchInputProps) => {
  return (
    <div className="inpute-search-box">
      <label htmlFor={id}>{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
      />
    </div>
  )
}

export default SearchInput;
