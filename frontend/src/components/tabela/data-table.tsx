"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { Input } from "../ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filtroTexto?: {
    colunaFiltro: string;
    mensagemFiltro: string;
  };
  filtroGlobal?: boolean;
  filtroDropDown?: {
    coluna: string;
    titulo: string;
    separar?: boolean;
  }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filtroTexto,
  filtroDropDown,
  filtroGlobal,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
      columnVisibility,
    },
  });

  React.useEffect(() => {
    const columnIds = columns.map((col: any) => col.accessorKey);
    const initialColumnVisibility = columns
      .filter((col: any) => col.meta?.show === false)
      .map((col: any) => col.accessorKey)
      .reduce((visibilityState, columnId) => {
        visibilityState[columnId] = !columnIds.includes(columnId);
        return visibilityState;
      }, {});

    setColumnVisibility(initialColumnVisibility);
  }, [columns]);

  return (
    <div className="rounded-3xl border-[5px] border-azul-culti-escuro pb-2 overflow-hidden">
      <div className="flex items-center p-4">
        {filtroTexto && (
          <Input
            placeholder={filtroTexto.mensagemFiltro}
            value={
              (table
                .getColumn(filtroTexto.colunaFiltro)
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn(filtroTexto.colunaFiltro)
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        {filtroGlobal && (
          <Input
            placeholder={"Procurar na tabela..."}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        )}
      </div>
      <div className="flex gap-2 pl-4 pb-4">
        {filtroDropDown &&
          filtroDropDown.map((filtro, index) => (
            <DataTableFacetedFilter
              coluna={table.getColumn(filtro.coluna)!}
              titulo={filtro.titulo}
              key={index}
              separar={filtro.separar}
            />
          ))}
      </div>
      <Table>
        <TableHeader className="border">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="py-7">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {/* TODO: romover o tamanha de texto */}
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="border-l-2 border-b-2 text-lg"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nenhum Resultado Encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}
