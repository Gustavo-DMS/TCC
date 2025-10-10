"use client";
import {
  pacientes_leitos,
  columns,
} from "@/app/(paginas)/cadastroPaciente/controle/columns";
import ButtonSubmit from "@/components/ButtonSubmit";
import { openPdfAndPrint } from "@/components/cadastroFarmacos/FormCadastroFarmacos";
import { DataTableForm } from "@/components/tabela/data-table-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  id: z.array(z.coerce.number()),
});

type schema = z.infer<typeof schema>;

export default function FormControlePacientes({
  data,
}: {
  data: pacientes_leitos[];
}) {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const onSuccess = async (data: schema) => {
    const insert = await fetch(
      "http://localhost:4000/cadastroPaciente/controle",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (insert.ok) {
      toast.success("Dados enviados com sucesso!");
    } else {
      toast.error("Erro ao enviar dados.Tente novamente.");
    }
  };

  const onError = () => {
    toast.error("Erro ao enviar dados. Verifique os campos.");
  };
  return (
    <div className="mt-10">
      <Controller
        name={`id`}
        control={form.control}
        render={({ field }) => (
          <DataTableForm
            data={data}
            columns={columns}
            columnVisibilityState={{ id: false }}
            filtroGlobal
            filtroSelecionados
            className="bg-white"
            formIntegration={{ form: form, field: field, tableColumn: "id" }}
          />
        )}
      />
      <ButtonSubmit onClick={form.handleSubmit(onSuccess, onError)} />
    </div>
  );
}
