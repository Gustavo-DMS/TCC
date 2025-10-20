import { Logs } from "lucide-react";
import FormControlePacientes from "@/components/cadastroPacientes/controle/FormControlePacientes";

export default async function Page() {
  const res = await fetch(`http://backend:4000/cadastroPaciente/controle`);
  const data = await res.json();
  return (
    <main>
      <div className="flex flex-row items-center gap-5">
        <div className="bg-white rounded-full w-20 h-20 flex justify-center items-center shadow-white shadow">
          <Logs color="black" size={50} />
        </div>
        <p className="bg-[#254370] p-3 px-7 rounded-full text-white text-lg">
          Saída de Pacientes
        </p>
      </div>
      <FormControlePacientes data={data["data"]} />
    </main>
  );
}
