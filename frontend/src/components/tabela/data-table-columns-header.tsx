"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";
import { ChevronsUpDown, SortAsc, SortDesc } from "lucide-react";
import { useState } from "react";

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    const [sorting, setSorting] = useState(false);
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }

    function ToggleSorting() {
        setSorting(!sorting);
        // console.log(sorting);
        column.toggleSorting(sorting);
    }

    return (
        <div className={cn("flex items-center space-x-2 text-black ", className)}>
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent "
                onClick={(e) => {
                    e.preventDefault();
                    ToggleSorting();
                }}
            >
                {/* TODO: Romover o tamanho do texto */}
                <p className="text-lg" >{title}</p>
                <div className="flex-shrink-0">
                    {column.getIsSorted() === "desc" ? (
                        <SortDesc className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "asc" ? (
                        <SortAsc className="ml-2 h-4 w-4" />
                    ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 " />
                    )}
                </div>
            </Button >
        </div >
    );
}
