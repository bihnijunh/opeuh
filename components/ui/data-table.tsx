import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Column<T> {
  accessorKey: keyof T;
  header: string;
  cell?: (value: any) => React.ReactNode;
}

interface DataTableProps<TData> {
  columns: Column<TData>[];
  data: TData[];
}

export function DataTable<TData>({
  columns,
  data,
}: DataTableProps<TData>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessorKey.toString()}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.accessorKey.toString()}>
                  {column.cell
                    ? column.cell(row[column.accessorKey])
                    : row[column.accessorKey] as React.ReactNode}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}