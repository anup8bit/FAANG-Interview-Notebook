const Input = ({
  value,
  name,
  placeholder,
  id,
  className,
  label,
  onChange,
  onKeyDown,
  ref
}) => {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <input
        name={name}
        value={value}
        className="auto-complete-input-field"
        id={id}
        onChange={onChange}
        ref={ref}
        onKeyDown={onKeyDown}
        autoComplete="off"
      />
    </div>
  )
}

export default Input;
