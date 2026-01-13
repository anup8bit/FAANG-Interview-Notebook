export interface ColumnItemProps {
  name: string;
  label: string;
  key?: string;
  className?: string;
  id?: string;
}

export interface ColumnProps {
  columns: ColumnItemProps[],
  key?: string;
}

export interface RowProps  {
  data: Record<string, any>[],
  columns: ColumnItemProps[],
  key?: string;
  className?: string;
  rowData?: Record<string, any>
}

export interface TableProps {
  data: Record<string, any>[],
  columns: ColumnItemProps[],
  key?: string;
  id?: string;
  testId?: string;
}

export interface CellProp {
  value?: string;
  key?: string;
}