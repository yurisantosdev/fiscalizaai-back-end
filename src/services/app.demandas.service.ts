/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { DemandasCreateType, DemandasUpdateType } from 'src/types/DemandasType';
import { exibirDataHoraAtual } from 'src/utils/obterDataHoraAtual';

@Injectable()
export class DemandasService {
  // eslint-disable-next-line prettier/prettier
  constructor(readonly prisma: PrismaService) { }

  async create(demanda: DemandasCreateType) {
    try {
      await this.prisma.$transaction(async (prisma) => {
        const demandaCadastrada = await prisma.demandas.create({
          data: {
            dmcodigo: randomUUID(),
            dmregistrado: exibirDataHoraAtual(),
            dmstatus: 'PENDENTE',
            dmtitle: demanda.dmtitle,
          },
        });

        for (const relato of demanda.relatos) {
          await prisma.relatosDemandas.create({
            data: {
              rdcodigo: randomUUID(),
              rddemanda: demandaCadastrada.dmcodigo,
              rdrelato: relato,
            },
          });
        }
      });

      return { status: true, message: 'Demanda cadastrada com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível criar a demanda, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async update(demanda: DemandasUpdateType) {
    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.demandas.update({
          where: { dmcodigo: demanda.dmcodigo },
          data: {
            dmtitle: demanda.dmtitle,
            dmstatus: demanda.dmstatus,
            dmresponsavel: demanda.dmresponsavel,
            updatedAt: new Date(),
          },
        });

        await prisma.relatosDemandas.deleteMany({
          where: { rddemanda: demanda.dmcodigo },
        });

        for (const relato of demanda.relatos) {
          await prisma.relatosDemandas.create({
            data: {
              rdcodigo: randomUUID(),
              rddemanda: demanda.dmcodigo,
              rdrelato: relato,
            },
          });
        }
      });

      return { status: true, message: 'Demanda atualizada com sucesso!' };
    } catch (error) {
      console.log(error)
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível atualizar a demanda, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async findAll() {
    try {
      let demandas;

      await this.prisma.$transaction(async (prisma) => {
        demandas = await prisma.demandas.findMany({
          select: {
            dmcodigo: true,
            dmtitle: true,
            dmregistrado: true,
            dmstatus: true,
            responsavel: {
              select: {
                uscodigo: true,
                usnome: true,
              },
            },
            RelatosDemandas: {
              select: {
                rdcodigo: true,
                relato: {
                  select: {
                    decodigo: true,
                    decategoria: true,
                    dedescricao: true,
                    delocalizacao: true,
                    dedata: true,
                    destatus: true,
                    deusuario: true,
                    localizacao: {
                      select: {
                        edcodigo: true,
                        edrua: true,
                        edestado: true,
                        edmunicipio: true,
                        ednumero: true,
                        edcomplemento: true,
                        edcep: true,
                        edbairro: true,
                        edlatitude: true,
                        edlongitude: true,
                        municipio: {
                          select: {
                            mccodigo: true,
                            mcmunicipio: true,
                            mcestado: true,
                            mclatitude: true,
                            mclongitude: true,
                          }
                        },
                        estado: {
                          select: {
                            escodigo: true,
                            esestado: true,
                            essigla: true,
                          },
                        },
                      }
                    },
                    categoria: {
                      select: {
                        cacodigo: true,
                        cacategoria: true,
                        cadescricao: true,
                      },
                    },
                    usuario: {
                      select: {
                        uscodigo: true,
                        usnome: true,
                        usemail: true,
                      }
                    },
                    HistoricoRelatos: {
                      select: {
                        hrcodigo: true,
                        hrtratativa: true,
                      }
                    },
                  },
                },
              },
            },
          },
        });
      });

      return { status: true, message: 'Demandas consultada com sucesso!', demandas };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível consultar as demandas, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async find(dmcodigo: string) {
    try {
      let demanda;

      await this.prisma.$transaction(async (prisma) => {
        demanda = await prisma.demandas.findFirst({
          where: {
            dmcodigo,
          },
          select: {
            dmcodigo: true,
            dmtitle: true,
            dmregistrado: true,
            dmstatus: true,
            responsavel: {
              select: {
                uscodigo: true,
                usnome: true,
              },
            },
            RelatosDemandas: {
              select: {
                rdcodigo: true,
                relato: {
                  select: {
                    decodigo: true,
                    decategoria: true,
                    dedescricao: true,
                    delocalizacao: true,
                    dedata: true,
                    destatus: true,
                    deusuario: true,
                    localizacao: {
                      select: {
                        edcodigo: true,
                        edrua: true,
                        edestado: true,
                        edmunicipio: true,
                        ednumero: true,
                        edcomplemento: true,
                        edcep: true,
                        edbairro: true,
                        edlatitude: true,
                        edlongitude: true,
                        municipio: {
                          select: {
                            mccodigo: true,
                            mcmunicipio: true,
                            mcestado: true,
                            mclatitude: true,
                            mclongitude: true,
                          }
                        },
                        estado: {
                          select: {
                            escodigo: true,
                            esestado: true,
                            essigla: true,
                          },
                        },
                      }
                    },
                    categoria: {
                      select: {
                        cacodigo: true,
                        cacategoria: true,
                        cadescricao: true,
                      },
                    },
                    usuario: {
                      select: {
                        uscodigo: true,
                        usnome: true,
                        usemail: true,
                      }
                    },
                    HistoricoRelatos: {
                      select: {
                        hrcodigo: true,
                        hrtratativa: true,
                      }
                    },
                  },
                },
              },
            },
          },
        });
      });

      return { status: true, message: 'Demanda consultada com sucesso!', demanda };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível atualizar a demanda, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async delete(dmcodigo: string) {
    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.relatosDemandas.deleteMany({
          where: {
            rddemanda: dmcodigo,
          },
        });

        await prisma.demandas.delete({
          where: {
            dmcodigo,
          },
        });
      });

      return { status: true, message: 'Demanda deletada com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível deletar a demanda, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }
}
