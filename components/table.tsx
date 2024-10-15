import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Spinner } from "@nextui-org/spinner";

interface TableData {
  [key: string]: any;
}

interface TableComponentProps {
  data: TableData[];
  columns: string[];
  loading: boolean;
}

const TableComponent: React.FC<TableComponentProps> = ({
  data,
  columns,
  loading,
}) => {
  return (
    <Table aria-label="Table">
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column}>{column}</TableColumn>
        ))}
      </TableHeader>
      <TableBody
        isLoading={loading}
        loadingContent={<Spinner label="Loading..." />}
      >
        {data.map((row, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={`${index}-${column}`}>{row[column]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableComponent;
