"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
    className?: string;
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
    formIntegration?: {
        form: any;
        field: any;
        tableColumn: string;
    };
    getSelection?: (rows: any[]) => void;
    filtroSelecionados?: boolean;
    columnVisibilityState?: any;
}

export function DataTableForm<TData, TValue>({
    columns,
    data,
    filtroTexto,
    filtroGlobal,
    filtroDropDown,
    formIntegration,
    getSelection,
    className,
    filtroSelecionados,
    columnVisibilityState,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        [],
    );
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [rowSelection, setRowSelection] = React.useState({});

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
        state: {
            sorting,
            columnFilters,
            rowSelection,
            globalFilter,
        },
        enableHiding: true,
        initialState: {
            columnVisibility: columnVisibilityState,
        },
    });
    React.useEffect(() => {
        table.getCoreRowModel().rows.map((row) => {
            if (
                formIntegration?.field.value?.includes(
                    (row.original as any)[formIntegration?.tableColumn!],
                )
            ) {
                row.toggleSelected(true);
            }
        });
        if (getSelection) {
            getSelection(table.getSelectedRowModel().rows.map((row) => row.original));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (formIntegration) {
            const form = formIntegration.form;
            const field = formIntegration.field.name;
            const selectedRows = table
                .getSelectedRowModel()
                .rows.map((row) => (row.original as any)[formIntegration.tableColumn!]);
            form.setValue(field, selectedRows);
        }
        if (getSelection) {
            getSelection(table.getSelectedRowModel().rows.map((row) => row.original));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelection]);

    return (
        <div
            className={cn(
                "rounded-3xl border-[5px] border-azul-culti-escuro pb-2 overflow-hidden text-black",
                className,
            )}
        >
            <div className="flex flex-wrap items-center">
                <div className="flex items-center p-4 w-96">
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

                {filtroSelecionados && (
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="airplane-mode"
                            onCheckedChange={(e) =>
                                table.getColumn("select")?.setFilterValue(e)
                            }
                        />
                        <Label htmlFor="airplane-mode">Mostrar apenas selecionados</Label>
                    </div>
                )}

                <div className="flex gap-2 items-center p-4 pl-4">
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
            </div>
            <Table>
                <TableHeader className="border">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
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
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="border-b-2 border-l-2">
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
