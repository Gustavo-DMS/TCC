"use client";
import { VirtualizedCombobox } from "@/components/Combobox";
import Quantidade from "@/components/Quantidade";
import { SaidaMedicamentos } from "@/types/saidaMedicamentos";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ButtonSubmit from "../ButtonSubmit";
import { useSession } from "next-auth/react";
import { dataBRL, fetchAPIs } from "@/lib/utils";
import { Label } from "../ui/label";
import { Card } from "../ui/card";

const schema = z.object({
  medicamento: z.coerce.number({ message: "Medicamento inválido" }),
  quantidade: z.number().min(1, "Quantidade deve ser maior que zero"),
  leito: z.number({ message: "Selecione um leito" }),
  caixa: z.number({ message: "Selecione uma caixa" }),
  funcionario_responsavel: z.number({
    message: "Selecione o funcionário responsável",
  }),
  funcionario_registro: z.number(),

  id_terminal_origem: z.number(),
});

type schema = z.infer<typeof schema>;

type responseCaixa = {
  medicamentos?: {
    quantidade_atual: number;
    id: number;
    id_medicamento: string;
    d_vencimento: string;
    dt_fim_caixa: string | null;
    dt_registro: string;
    medicamento_nome: string;
    obs_qtde: string;
  };
  error?: string;
  alert?: string;
};

export default function SaidaMedicamento({
  data,
}: {
  data: SaidaMedicamentos;
}) {
  const [inputValue, setInputValue] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState<responseCaixa>();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      quantidade: 0,
      id_terminal_origem: 1,
    },
  });
  const { data: session } = useSession();

  useEffect(() => {
    form.setValue("funcionario_registro", session?.user?.id as number);
  }, [session]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const fetchMedicamentos = async () => {
      const res = await fetchAPIs(
        `/saidaMedicamentos/caixa?id=${inputValue || "0"}`,
        {},
        true,
      );
      const medicamentos = await res.json();
      console.log(medicamentos);
      if (!res.ok) {
        toast.error("Erro ao Resgatar informações da caixa.Tente novamente.");
      }
      if (medicamentos.medicamentos?.quantidade_atual === 0) {
        setOpen(true);
        medicamentos.alert =
          "Parece que essa caixa está vazia. Verifique que está tentando usar a caixa correta.";
        inputRef.current?.blur();
      } else if (
        new Date(medicamentos.medicamentos?.d_vencimento) < new Date()
      ) {
        setOpen(true);
        inputRef.current?.blur();
        medicamentos.alert =
          "Atenção! Essa caixa está vencida. Verifique se está tentando usar a caixa correta.";
      }
      setDebouncedValue(medicamentos);
    };
    const handler = setTimeout(() => {
      fetchMedicamentos();
    }, 250); // Adjust debounce time (e.g., 500ms) as needed

    return () => {
      clearTimeout(handler); // Clear timeout on re-render or unmount
    };
  }, [inputValue, refresh]);

  const onSuccess = async (data: schema) => {
    if (!debouncedValue?.medicamentos) {
      form.setError("medicamento", { message: "Medicamento inválido" });
      return;
    }

    const insert = await fetchAPIs(
      "/saidaMedicamentos",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
      true,
    );

    if (insert.ok) {
      toast.success("Dados enviados com sucesso!");
      setRefresh(!refresh);
    } else {
      toast.error("Erro ao enviar dados.Tente novamente.");
    }
  };

  const onError = (data: any) => {
    toast.error("Erro ao enviar dados. Verifique os campos.");
  };

  const filterFn = (value: string) => {
    return data["caixas"].filter((item) =>
      item.descricao.toLowerCase().includes(value.toLowerCase()),
    );
  };

  return (
    <div className="flex flex-row p-5 rounded-lg justify-between mt-10">
      <div className="flex flex-col gap-10  w-[210px]">
        <AlertDialog onOpenChange={setOpen} open={open}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Ops! Parece que tem algo de errado
              </AlertDialogTitle>
            </AlertDialogHeader>
            {debouncedValue?.alert}
            <AlertDialogFooter>
              <AlertDialogAction variant={"destructive"}>
                Estou ciente
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <form className="flex flex-col gap-5">
          <div>
            <Label className="mb-2 text-white uppercase font-bold">
              Código da caixa:
            </Label>
            <Input
              className="bg-white"
              onChange={(e) => {
                setInputValue(e.target.value);
                //@ts-ignore
                form.setValue("medicamento", e.target.value);
              }}
              autoComplete="off"
              ref={inputRef}
            />
            {form.formState.errors.medicamento && (
              <p className="text-red-500">
                {form.formState.errors.medicamento?.message}
              </p>
            )}
          </div>
          <div>
            <Label className="mb-2 text-white uppercase font-bold">
              Quantidade Consumida:
            </Label>
            <Quantidade
              formData={{ form, formField: "quantidade" }}
              limite={debouncedValue?.medicamentos?.quantidade_atual || 100}
            />
            {form.formState.errors.quantidade && (
              <p className="text-red-500">
                {form.formState.errors.quantidade?.message}
              </p>
            )}
          </div>
          <div>
            <Label className="mb-2 text-white uppercase font-bold">
              Funcionário Responsável:
            </Label>
            <VirtualizedCombobox
              data={data["funcionarios"]}
              displayFunc={(item: any) => item.nome}
              filterFn={(value: string) =>
                data.funcionarios.filter((item) =>
                  item.nome.toLowerCase().includes(value.toLowerCase()),
                )
              }
              chave="id"
              formData={{ form, formField: "funcionario_responsavel" }}
            />
            {form.formState.errors.funcionario_responsavel && (
              <p className="text-red-500">
                {form.formState.errors.funcionario_responsavel?.message}
              </p>
            )}
          </div>
          <div>
            <Label className="mb-2 text-white uppercase font-bold">
              Leito de Destino:
            </Label>
            <VirtualizedCombobox
              data={data["leitos"]}
              displayFunc={(item: any) => item.descricao}
              filterFn={(value: string) =>
                data.leitos.filter((item) =>
                  item.descricao.toLowerCase().includes(value.toLowerCase()),
                )
              }
              chave="id"
              formData={{ form, formField: "leito" }}
            />
            {form.formState.errors.leito && (
              <p className="text-red-500">
                {form.formState.errors.leito?.message}
              </p>
            )}
          </div>
          <div>
            <Label className="mb-2 text-white uppercase font-bold">
              Caixa Utilizada:
            </Label>
            <VirtualizedCombobox
              chave="id"
              filterFn={filterFn}
              data={data["caixas"]}
              displayFunc={(item: any) => item.descricao}
              formData={{ form, formField: "caixa" }}
            />
            {form.formState.errors.caixa && (
              <p className="text-red-500">
                {form.formState.errors.caixa?.message}
              </p>
            )}
          </div>
          <ButtonSubmit onClick={form.handleSubmit(onSuccess, onError)} />
        </form>
      </div>
      {debouncedValue?.error && (
        <div>
          <p className="text-red-500">{debouncedValue.error}</p>
        </div>
      )}
      <Card className="flex flex-col w-1/2 px-2 gap-5">
        <h2 className="font-bold text-lg mx-auto">Informações da caixa</h2>
        <div>
          <Label className="mb-2 text-black uppercase font-bold">
            Nome do medicamento:
          </Label>
          <Input
            className="text-black border-black border-2 shrink"
            value={
              debouncedValue?.medicamentos
                ? debouncedValue?.medicamentos?.medicamento_nome
                : "Nenhuma caixa selecionada"
            }
            readOnly
            inert
          />
        </div>
        <div>
          <Label className="mb-2 text-black uppercase font-bold">
            Quantidade Atual:
          </Label>
          <Input
            className="text-black border-black border-2 shrink"
            value={
              debouncedValue?.medicamentos
                ? `${debouncedValue?.medicamentos?.quantidade_atual} ${debouncedValue?.medicamentos?.obs_qtde}`
                : "Nenhuma caixa selecionada"
            }
            readOnly
            inert
          />
        </div>
        <div>
          <Label className="mb-2 text-black uppercase font-bold">
            Data de vencimento:
          </Label>
          <Input
            className="text-black border-black border-2 shrink"
            value={
              debouncedValue?.medicamentos
                ? dataBRL(debouncedValue?.medicamentos?.d_vencimento, true)
                : "Nenhuma caixa selecionada"
            }
            readOnly
            inert
          />
        </div>
        <div>
          <Label className="mb-2 text-black uppercase font-bold">
            Data de registro:
          </Label>
          <Input
            className="text-black border-black border-2 shrink"
            value={
              debouncedValue?.medicamentos
                ? dataBRL(debouncedValue?.medicamentos?.dt_registro)
                : "Nenhuma caixa selecionada"
            }
            readOnly
            inert
          />
        </div>
      </Card>
    </div>
  );
}
