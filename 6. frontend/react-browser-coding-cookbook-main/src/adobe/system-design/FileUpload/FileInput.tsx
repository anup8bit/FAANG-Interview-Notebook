import { FileInputProps } from "./type";

const FileInput = ({
  label,
  className,
  id,
  name,
  placeholder,
  multiple,
  onChange
} : FileInputProps) => {
  return (
    <div className="file-input-wrapper">
      <div className="file-input-label">
        <label htmlFor={id}>{label}</label>
      </div>
      <input
        type="file"
        name={name}
        id={id}
        className={className}
        onChange={onChange}
        multiple
      />
    </div>
  )
}

export default FileInput;
