"use client";
import { toast } from "sonner";
import { ExampleCombobox, VirtualizedCombobox } from "@/components/Combobox";
import { Calendar28 } from "@/components/DatePicker";
import Quantidade from "@/components/Quantidade";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import ButtonSubmit from "../ButtonSubmit";
import { Input } from "../ui/input";

const schema = z.object({
  farmaco: z.number({ message: "Selecione um medicamento" }).min(1),
  dt_vencimento: z
    .date({ message: "Selecione uma data" })
    .min(new Date(), "Data de vencimento não pode ser no passado"),
  quantidade: z.number().min(1, "Quantidade deve ser maior que zero"),
  lote: z.string({ message: "Informe o lote" }).min(1, "Informe o lote"),
});

type schema = z.infer<typeof schema>;

export function FormCadastroFarmacos({
  farmacos,
}: {
  farmacos: {
    id: number;
    nome: string;
    cod_anvisa: number;
    apresentacao: string;
  }[];
}) {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const onSuccess = async (data: schema) => {
    const insert = await fetch("http://localhost:4000/cadastroFarmacos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (insert.ok) {
      toast.success("Dados enviados com sucesso!");
      const blob = await insert.blob();
      openPdfAndPrint(blob);
    } else {
      toast.error("Erro ao enviar dados.Tente novamente.");
    }
  };

  const onError = () => {
    toast.error("Erro ao enviar dados. Verifique os campos.");
  };

  const filterFn = (value: string) => {
    return farmacos.filter((item) =>
      item.nome.toLowerCase().includes(value.toLowerCase()),
    );
  };

  return (
    <div className="flex flex-col gap-10 mt-10 w-[210px]">
      <div>
        <Label className="mb-2">Escolha do fármaco</Label>
        <VirtualizedCombobox
          // data={farmacos}
          chave="id"
          formData={{ form, formField: "farmaco" }}
          filterFn={filterFn}
          displayFunc={(item: (typeof farmacos)[0]) =>
            `${item.nome} - ${item.apresentacao}`
          }
          data={farmacos}
          placeholder="Escolha do fármaco"
        >
          <div className="text-sm text-gray-500">
            Digite o nome ou código ANVISA
          </div>
        </VirtualizedCombobox>
        {form.formState.errors.farmaco && (
          <p className="text-red-500">
            {form.formState.errors.farmaco?.message}
          </p>
        )}
      </div>
      <div>
        <Input {...form.register("lote")} autoComplete="off" />
        {form.formState.errors.lote && (
          <p className="text-red-500">{form.formState.errors.lote?.message}</p>
        )}
      </div>
      <div>
        <Quantidade formData={{ form, formField: "quantidade" }} />
        {form.formState.errors.quantidade && (
          <p className="text-red-500">
            {form.formState.errors.quantidade?.message}
          </p>
        )}
      </div>
      <div>
        <Calendar28 formData={{ form, formField: "dt_vencimento" }} />
        {form.formState.errors.dt_vencimento && (
          <p className="text-red-500">
            {form.formState.errors.dt_vencimento?.message}
          </p>
        )}
      </div>
      <ButtonSubmit onClick={form.handleSubmit(onSuccess, onError)} />
    </div>
  );
}

export function openPdfAndPrint(pdfBlob: any) {
  if (!pdfBlob) return;

  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Open a new blank window
  const newWindow = window.open("", "_blank");

  if (!newWindow) {
    console.error("Popup blocked");
    return;
  }

  // Write HTML with an iframe pointing to the PDF
  newWindow.document.write(`
    <html>
      <head><title>Print PDF</title></head>
      <body style="margin:0">
        <iframe src="${pdfUrl}" style="width:100%;height:100vh;" frameborder="0" onload="this.contentWindow.focus(); this.contentWindow.print();"></iframe>
      </body>
    </html>
  `);

  newWindow.document.close();

  // Cleanup the object URL after some time
  setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);
}
