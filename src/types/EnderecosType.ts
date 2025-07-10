export type EnderecosType = {
  edcodigo?: string;
  edrua?: string;
  edestado?: string;
  edmunicipio?: string;
  ednumero?: string;
  edcomplemento?: string;
  edpontoreferencia?: string;
  edcep?: string;
  edbairro?: string;
  edlatitude?: string;
  edlongitude?: string;
  edproblema?: boolean;
  createdAt?: string;
  updatedAt?: string;
  municipio?: MunicipiosType;
  estado?: EstadosType;
};
export type MunicipiosType = {
  mccodigo?: string;
  mcmunicipio: string;
  mcestado: string;
  mclatitude: number;
  mclongitude: number;
  createdAt?: string;
  updatedAt?: string;
};

export type EstadosType = {
  escodigo: string;
  esestado: string;
  essigla: string;
  createdAt: string;
  updatedAt: string;
};
