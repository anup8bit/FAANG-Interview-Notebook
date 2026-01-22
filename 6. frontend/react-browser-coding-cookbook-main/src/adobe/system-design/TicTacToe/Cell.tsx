import { Player } from "./type";

interface CellProps {
  row: number;
  col: number;
  value: Player | undefined;
  handleClick: (row: number, col: number) => void;
  isDisabled: boolean;
}

const Cell = ({row, col, value, handleClick, isDisabled}: CellProps) => {
  const handleMove = () => {
    handleClick(row, col);
  }
  return (
    <button
      className="grid-cell"
      onClick={handleMove}
      key={`${row}-${col}`}
      disabled={isDisabled}
    >
      {value}
    </button>
  )
}

export default Cell;
