import { FormCadastroFarmacos } from "@/components/cadastroFarmacos/FormCadastroFarmacos";

export default async function FetchFarmFarmacos() {
  const req = await fetch("http://backend:4000/cadastroFarmacos");
  const farmacos = await req.json();

  return <FormCadastroFarmacos farmacos={farmacos["farmacos"]} />;
}
