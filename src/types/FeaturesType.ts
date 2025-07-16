import { FotosFeaturesType } from './FotosFeaturesType';

export type FeaturesType = {
  ftcodigo?: string;
  fttitulo: string;
  ftdescricao: string;
  ftquando: string;
  ftusuario: string;
  createdAt?: string;
  updatedAt?: string;
};

export type FeaturesCreateType = {
  fttitulo: string;
  ftdescricao: string;
  ftusuario: string;
  fotos: Array<FotosFeaturesType>;
};
