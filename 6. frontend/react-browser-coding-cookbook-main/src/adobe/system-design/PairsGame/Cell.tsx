import { forwardRef, RefObject, useEffect, useState } from "react";

interface CellProps {
  index: number,
  value: number | null;
  // ref: RefObject<HTMLButtonElement | null>;
  disabledClick: boolean;
  onClick: (val: number | null, index: number) => void;
}

const Cell = forwardRef<HTMLButtonElement, CellProps>(({
  index,
  value,
  disabledClick,
  onClick,
}, ref) => {

  const [show, setShow] = useState(false);

  const displayValue = show ? value : " ";

  useEffect(() => {
    if (disabledClick) {
      setTimeout(() => setShow(false), 1500);
    }
  }, [disabledClick])

  const handleClick = () => {
    if (disabledClick) return;
    setShow(show => !show);
    onClick(value, index);
  }

  const disabled = value === null;

  return (
    <button
      role="button"
      aria-disabled={disabled}
      ref={ref}
      onClick={handleClick}
      className="grid-cell"
      disabled={disabled}
    >
      <span className="grid-cell-value">{displayValue}</span>
    </button>
  )
});

export default Cell;