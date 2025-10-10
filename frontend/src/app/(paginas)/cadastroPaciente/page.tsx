import { FormCadastro } from "@/components/cadastroPacientes/FormCadastro";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="flex gap-4 h-full items-center justify-center">
      <Link
        className="bg-blue-400 w-1/2 h-3/5 items-center justify-center flex rounded-lg text-white font-bold hover:bg-blue-500"
        href={"cadastroPaciente/controle"}
      >
        Saida de pacientes
      </Link>

      <Link
        className="bg-blue-400 w-1/2 h-3/5 items-center justify-center flex rounded-lg text-white font-bold hover:bg-blue-500"
        href={"cadastroPaciente/cadastro"}
      >
        Associar um novo leito
      </Link>
    </div>
  );
}
