"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/tabela/data-table-columns-header";
import { Checkbox } from "@/components/ui/checkbox";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type pacientes_leitos = {
  ativo: boolean;
  descricao_terminal: string;
  dt_ativacao: string;
  id: number;
  id_paciente: number;
  id_terminal: number;
  nome_paciente: string;
};

export const columns: ColumnDef<pacientes_leitos>[] = [
  {
    // accessorKey: "select",
    id: "select",
    header: ({ table }) => (
      <div className="flex pr-4">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value ? row.getIsSelected() : true;
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "nome_paciente",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome Paciente" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "descricao_terminal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leito" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "dt_ativacao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inicio Estadia" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
