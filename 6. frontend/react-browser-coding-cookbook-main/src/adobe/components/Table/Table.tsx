import Column, { ColumnItemProps, ColumnProps } from "./Column"
import Row from "./Row"

interface TableProps {
    columns: ColumnItemProps[];
    data: Record<string, any>[],
    className?: string;
    id?: string;
}

const Table = ({
    columns,
    data,
    className,
    id,
}: TableProps) => {
    return (
        <table className={className} id={id}>
            <Column columns={columns} />
            {data.map((rowItem, index) => (
                <Row
                 row={rowItem}
                 columns={columns}
                />
            ))}
        </table>
    )
}


export default Table;