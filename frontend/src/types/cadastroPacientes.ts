export interface CadastroPaciente {
  leitos: {
    ativo: boolean;
    descricao: string;
    dt_ativacao: string;
    dt_desativacao: string | null;
    id: number;
    leito: boolean;
  }[];
  pacientes: {
    d_nascimento: string;
    id: number;
    nome: string;
  }[];
}
