import { FormCadastroFarmacos } from "@/components/cadastroFarmacos/FormCadastroFarmacos";
import { NotebookPen } from "lucide-react";

export default async function Home() {
  const req = await fetch("http://backend:4000/cadastroFarmacos");
  const farmacos = await req.json();

  return (
    <main>
      <div className="flex flex-row items-center gap-5">
        <div className="bg-white rounded-full w-20 h-20 flex justify-center items-center shadow-white shadow">
          <NotebookPen color="black" size={50} />
        </div>
        <p className="bg-[#254370] p-3 px-7 rounded-full text-white text-lg">
          Cadastro de fármacos
        </p>
      </div>
      <FormCadastroFarmacos farmacos={farmacos["farmacos"]} />
    </main>
  );
}
