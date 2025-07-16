/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { FeaturesCreateType } from 'src/types/FeaturesType';
import { exibirDataHoraAtual } from 'src/utils/obterDataHoraAtual';

@Injectable()
export class FeaturesService {
  // eslint-disable-next-line prettier/prettier
  constructor(readonly prisma: PrismaService) { }

  async create(feature: FeaturesCreateType) {
    try {
      await this.prisma.$transaction(async (prisma) => {

        await prisma.features.create({
          data: {
            ftcodigo: randomUUID(),
            fttitulo: feature.fttitulo,
            ftdescricao: feature.ftdescricao,
            ftquando: exibirDataHoraAtual(),
            ftusuario: feature.ftusuario,
            fotosFeatures: {
              create: feature.fotos?.map(foto => ({
                ffcodigo: randomUUID(),
                fffoto: foto.fffoto,
                ffdescricao: foto.ffdescricao,
              })) || [],
            }
          }
        });

        return { status: true, message: 'Feature cadastrado com sucesso!' };
      });
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível criar a Feature, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async find(ftcodigo: string) {
    try {
      let feature;

      await this.prisma.$transaction(async (prisma) => {
        feature = await prisma.features.findFirst({
          where: {
            ftcodigo,
          },
          select: {
            ftcodigo: true,
            fttitulo: true,
            ftdescricao: true,
            ftquando: true,
            usuario: {
              select: {
                uscodigo: true,
                usnome: true,
              },
            },
            fotosFeatures: {
              select: {
                ffcodigo: true,
                fffoto: true,
                ffdescricao: true,
              },
            },
          },
        });
      });

      return { status: true, message: 'Feature consultadas com sucesso!', feature };

    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível consulta a feature, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async findAll() {
    try {
      let features;

      await this.prisma.$transaction(async (prisma) => {
        features = await prisma.features.findMany({
          select: {
            ftcodigo: true,
            fttitulo: true,
            ftdescricao: true,
            ftquando: true,
            usuario: {
              select: {
                uscodigo: true,
                usnome: true,
              },
            },
            fotosFeatures: {
              select: {
                ffcodigo: true,
                fffoto: true,
                ffdescricao: true,
              },
            },
          },
        });
      });

      return { status: true, message: 'Features consultadas com sucesso!', features };

    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível consultar as features, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }
}
