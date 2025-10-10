"use client";
import { CadastroPaciente } from "@/types/cadastroPacientes";
import { useForm } from "react-hook-form";
import { ExampleCombobox } from "../Combobox";
import ButtonSubmit from "../ButtonSubmit";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  leito: z.number({ message: "Selecione um leito" }).min(1),
  paciente: z.number({ message: "Selecione um paciente" }).min(1),
});

type schema = z.infer<typeof schema>;

export function FormCadastro({ data }: { data: CadastroPaciente }) {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const onSuccess = async (data: schema) => {
    const insert = await fetch("http://localhost:4000/cadastroPaciente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

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
    <div className="flex flex-col gap-4">
      <ExampleCombobox
        data={data["leitos"]}
        chave="id"
        value="descricao"
        formData={{ formField: "leito", form: form }}
      />
      <ExampleCombobox
        data={data["pacientes"]}
        chave="id"
        value="nome"
        formData={{ formField: "paciente", form: form }}
      />
      <ButtonSubmit onClick={form.handleSubmit(onSuccess, onError)} />
    </div>
  );
}
