import Cell from "./Cell";
import { ColumnItemProps } from "./Column";

interface RowProps {
    row: Record<string, any>
    index?: number;
    key?: string;
    className?: string;
    columns: ColumnItemProps[],
    data?: Record<string, any>[],
}

const Row = ({
    row,
    index,
    key,
    className,
    columns,
    data,
}: RowProps) => {
    return (
        <tr key={key}>
            {columns.map((col, index) => (
                <Cell
                    key={key ?? `${col.name}-${row[col?.name ?? ""]}`}
                    value={row[col?.name ?? ""]}
                />
            ))}
        </tr>
    )
}

export default Row;
