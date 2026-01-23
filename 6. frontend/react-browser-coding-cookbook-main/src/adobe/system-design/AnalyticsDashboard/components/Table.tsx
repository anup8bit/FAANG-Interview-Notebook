import TableColumn from "./TableColumn"
import TableRow from "./TableRows"
import { TableProps } from "./type"

const Table = ({
  columns,
  data,
  testId,
  id,
}: TableProps) => {
  return (
    <table test-id={testId} id={id}>
      <TableColumn columns={columns} />
      <tbody>
        {data.map((rowData, index) => (
          <TableRow data={data} columns={columns} rowData={rowData} key={index.toString()} />
        ))}
      </tbody>
    </table>
  )
}

export default Table;