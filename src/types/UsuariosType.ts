import { EnderecosType } from './EnderecosType';

export type UsuarioType = {
  uscodigo: string;
  usnome: string;
  usemail: string;
  ussenha: string;
  usendereco: string;
  usmaster: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UsuarioSimplesType = {
  uscodigo: string;
  usemail: string;
  usnome: string;
  usendereco: string;
  endereco: EnderecosType;
};

export type CriarUsuario = {
  usuario: UsuarioType;
  endereco: EnderecosType;
};

export type EsqueciSenhaType = {
  email: string;
};

export type RecuperacaoSenhaType = {
  codigo: number;
  uscodigo: string;
};

export type RedefinirSenhaType = {
  codigo: string;
  novaSenha: string;
  confirmarSenha: string;
};

export type TrocaSenhaType = {
  senhaAntiga: string;
  novaSenha: string;
  confirmarSenha: string;
  uscodigo: string;
};
