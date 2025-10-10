export interface SaidaMedicamentos {
  caixas: {
    ativo: boolean;
    descricao: string;
    dt_ativacao: string;
    dt_desativacao: string | null;
    id: number;
  }[];
  leitos: {
    descricao: string;
    nome: string;
  }[];
  funcionarios: {
    id: number;
    nome: string;
  }[];
}
