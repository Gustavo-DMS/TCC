import { NotebookPen } from "lucide-react";
import { Suspense } from "react";
import FetchFarmFarmacos from "./FetchCadastroFarmaco";
import Loading from "@/components/loading";

export default async function Home() {
  return (
    <main className="flex flex-col border-green-500 h-full">
      <div className="flex flex-row items-center gap-5 ">
        <div className="bg-white rounded-full w-20 h-20 flex justify-center items-center shadow-white shadow">
          <NotebookPen color="black" size={50} />
        </div>
        <p className="bg-[#254370] p-3 px-7 rounded-full text-white text-lg">
          Cadastro de fármacos
        </p>
      </div>
      <Suspense fallback={<Loading />}>
        <FetchFarmFarmacos />
      </Suspense>
    </main>
  );
}
