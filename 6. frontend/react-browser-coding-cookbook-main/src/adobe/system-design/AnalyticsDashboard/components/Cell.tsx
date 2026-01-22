import { CellProp } from "./type";

const Cell = ({
  value,
  key,
}: CellProp) => {
  return (
    <td key={`${key}-${value}`} className="table_cell">
      {value}
    </td>
  )
}

export default Cell;
