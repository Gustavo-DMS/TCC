import Link from "next/link";

export default async function Page() {
  return (
    <div className="flex gap-4 h-full items-center justify-center">
      <Link
        className="bg-blue-400 w-1/2 h-3/5 items-center justify-center flex rounded-lg text-white font-bold hover:bg-blue-500"
        href={"cadastroPaciente/saidaDePacientes"}
      >
        Saída de pacientes
      </Link>

      <Link
        className="bg-blue-400 w-1/2 h-3/5 items-center justify-center flex rounded-lg text-white font-bold hover:bg-blue-500"
        href={"cadastroPaciente/entradaDePacientes"}
      >
        Entrada de pacientes
      </Link>
    </div>
  );
}
