import { ColumnProps } from "./type";

const TableColumn = ({
  columns,
  key,
}: ColumnProps) => {
  return (
    <thead>
      <tr>
        {columns.map((col, index) => (
        <th key={`${col.name}`}>{col.label}</th>
      ))}
      </tr>
    </thead>
  )
}

export default TableColumn;