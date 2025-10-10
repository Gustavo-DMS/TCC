import SaidaMedicamento from "@/components/saidaMedicamento/SaidaMedicamento";
import { Package2 } from "lucide-react";

export default async function Home() {
  const req = await fetch("http://backend:4000/saidaMedicamentos");
  const data = await req.json();
  return (
    <main className="flex flex-col flex-grow mx-5 my-20 bg-[#456ca6] rounded-lg p-10 ">
      <div className="flex flex-row items-center gap-5">
        <div className="bg-white rounded-full w-20 h-20 flex justify-center items-center ">
          <Package2 color="black" size={40} />
        </div>
        <p className="bg-[#254370] p-3 px-7 rounded-full text-white text-lg">
          Saída de Medicamentos
        </p>
      </div>
      <SaidaMedicamento data={data} />
    </main>
  );
}
