export interface ColumnItemProps {
    name?: string;
    label?: string;
    key?: string;
    className?: string;
}

export interface ColumnProps {
    columns: ColumnItemProps[];
}

const Column = ({
    columns
}: ColumnProps) => {
    return (
        <thead>
            <tr>
                {columns.map((col, index) => (
                    <th key={`${col.name}-${index}`}>{col.label}</th>
                ))}
            </tr>
        </thead>
    )
}

export default Column;
