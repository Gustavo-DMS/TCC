import Funcoes from "@/components/Funcoes";
import {
  Activity,
  BedSingle,
  Binoculars,
  CircleDollarSign,
  FileClock,
  NotebookPen,
  Package2,
} from "lucide-react";
import { BreadcrumbCustom } from "@/components/Breadcrumb";
import { auth } from "../../auth";

// export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex grow flex-col">
      <BreadcrumbCustom />
      <div className="flex flex-col flex-grow mx-5 my-20 rounded-4xl p-10 bg-[#456ca6]/[var(--bg-opacity)] [--bg-opacity:70%] ">
        <div>
          <span className="flex flex-col mb-10 text-white">
            <h1 className="text-2xl">Bem-vindo, {session?.user.nome}</h1>
            <h2 className="text-xl">Selecione a função que deseja acessar</h2>
          </span>
          <div className="grid grid-rows-3 gap-10 grid-flow-col">
            <Funcoes link="cadastroFarmaco" text="Cadastro de Fármacos">
              <NotebookPen color="black" size={35} />
            </Funcoes>
            <Funcoes link="saidaMedicamentos" text="Saída de Medicamentos">
              <Package2 color="black" size={35} />
            </Funcoes>
            <Funcoes link="cadastroPaciente" text="Entrada de Pacientes">
              <Activity color="black" size={35} />
            </Funcoes>
            <Funcoes link="fds" text="Monitoramento de Estoque">
              <Binoculars color="black" size={35} />
            </Funcoes>
            <Funcoes link="fds" text="Histórico do Paciente">
              <FileClock color="black" size={35} />
            </Funcoes>
            <Funcoes link="fds" text="Custos operacionais">
              <CircleDollarSign color="black" size={35} />
            </Funcoes>
          </div>
        </div>
      </div>
    </main>
  );
}
