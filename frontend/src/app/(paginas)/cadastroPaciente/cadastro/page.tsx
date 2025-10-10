import { FormCadastro } from "@/components/cadastroPacientes/FormCadastroPacientes";

export default async function Page() {
  const res = await fetch(`http://backend:4000/cadastroPaciente`);
  const data = await res.json();
  return <FormCadastro data={data} />;
}
