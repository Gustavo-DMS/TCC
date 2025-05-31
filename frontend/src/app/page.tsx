import Funcoes from "@/components/Funcoes";
import { auth } from "../../auth";
import { Package2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
    // const session = await auth();

    return (
        <main className="flex flex-col flex-grow mx-5 my-20 bg-[#456ca6] rounded-lg p-10">
            <div>
                <h1 className="text-2xl">Bem-vindo,William</h1>
                <h2 className="text-xl">Selecione a função que deseja acessar</h2>
                <Funcoes link="teste">
                    <Package2 color="black" />
                </Funcoes>
            </div>
        </main>
    );
}
