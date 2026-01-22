import Cell from "./Cell"
import { RowProps } from "./type"

const TableRow = ({
  columns,
  data,
  rowData,
  key,
  className
}: RowProps) => {
  return (
    <tr className={className} key={key}>
      {columns.map((col, index) => (
        <Cell value={rowData?.[col.name]} key={`${col.name}-`} />
      ))}
    </tr>
  )
}

  export default TableRow;
  