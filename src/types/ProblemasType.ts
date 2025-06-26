import { CategoriasProblemasType } from './CategoriasProblemasType';
import { EnderecosType } from './EnderecosType';

export interface ProblemasType {
  decodigo: string;
  decategoria: string;
  dedescricao: string;
  delocalizacao: string;
  dedata: string;
  destatus: string;
  deusuario: string;
  localizacao: EnderecosType;
  fotos: Array<{ fdfoto: string }>;
}

export type CancelarProblemaType = {
  decodigo: string;
};

export type FindProblemaType = {
  decodigo: string;
};

export type AtualizarStatusRelatoType = {
  decodigo: string;
  destatus: StatusProblemasEnumType;
};

export type ExportarRelatorioType = {
  dados: any;
};

export type StatusProblemasEnumType =
  | 'EM_ANALISE'
  | 'RESOLVIDO'
  | 'PENDENTE'
  | 'EM_ANDAMENTO'
  | 'CORRIGIR';

export type ProblemasCriateType = {
  problemas: ProblemasType;
  endereco: EnderecosType;
  fotos: Array<string>;
};

export type ConsultaProblemasLocalizacaoUsuarioType = {
  uscodigo: any;
};

export type AprovarReprovarProblemaType = {
  decodigo: string;
  status: boolean;
  motivo: string;
  quando: string;
};

export type ProblemaSimplesType = {
  decodigo: string;
  decategoria: string;
  dedescricao: string;
  deusuario?: string;
  delocalizacao: string;
  dedata: string;
  destatus: string;
  edcodigo: string;
  edrua: string;
  edestado: string;
  edmunicipio: string;
  ednumero: string;
  edcomplemento: string;
  edcep: string;
  edbairro: string;
  edlatitude: string;
  edlongitude: string;
};

export type ProblemaLocalizacaoType = {
  decodigo: string;
  decategoria: string;
  dedescricao: string;
  delocalizacao: string;
  dedata: string;
  destatus: string;
  localizacao: EnderecosType;
  categoria: CategoriasProblemasType;
};
