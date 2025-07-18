export type StatusDemandassEnumType = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO';

export type DemandasType = {
  dmcodigo?: string;
  dmtitle: string;
  dmregistrado: string;
  dmstatus: StatusDemandassEnumType;
  dmresponsavel: string;
  createdAt?: string;
  updatedAt?: string;
};

export type DemandasCreateType = {
  dmtitle: string;
  relatos: Array<string>;
};

export type DemandasUpdateType = {
  dmcodigo: string;
  dmtitle: string;
  dmstatus: StatusDemandassEnumType;
  dmresponsavel: string;
  relatos: Array<string>;
};

export type DemandasDeleteType = {
  dmcodigo: string;
};

export type DemandasFindType = {
  dmcodigo: string;
};

export type RelatosDemandasType = {
  rdcodigo: string;
  rddemanda: string;
  rdrelato: string;
  createdAt: string;
  updatedAt: string;
};
