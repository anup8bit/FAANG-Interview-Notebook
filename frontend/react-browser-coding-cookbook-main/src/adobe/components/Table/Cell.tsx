import { ReactNode } from "react";

interface CellProps {
    key?: string;
    value?: ReactNode;
    className?: string;
}

const Cell = ({
    className,
    key,
    value,
}: CellProps) => {
    return (
        <td key={key} className={className}>
            {value}
        </td>
    )
}

export default Cell;