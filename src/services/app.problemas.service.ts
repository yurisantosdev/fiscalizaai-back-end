/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { AprovarReprovarProblemaType, CancelarProblemaType, ConsultaProblemasLocalizacaoUsuarioType, ProblemasType, AtualizarStatusRelatoType, FindProblemaType, ExportarRelatorioType } from 'src/types/ProblemasType';
import { EnderecosType } from 'src/types/EnderecosType';
import { EnderecosService } from './app.enderecos.service';
import { FotosProblemasService } from './app.fotosProblemas.service';
import { FotosProblemasType } from 'src/types/FontosProblemasType';
import { NotificacoesService } from './app.notificacoes.service';
import { NotificacoesType } from 'src/types/NotificacoesType';
import { HistoricoCorrecoesProblemasService } from './app.historicoCorrecoesProblemas.service';
import { HistoricoCorrecoesProblemasType } from 'src/types/HistoricoCorrecoesProblemasType';
import { HistoricoRelatosService } from './app.historicoRelatos.service';
import { HistoricoRelatosType } from 'src/types/HistoricoRelatosType';
import { exibirDataHoraAtual } from 'src/utils/obterDataHoraAtual';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import { FormatarDataBrasileira } from 'src/utils/Formatters';

@Injectable()
export class ProblemasServices {
  constructor(
    readonly prisma: PrismaService,
    private enderecoService: EnderecosService,
    private fotosProblemasService: FotosProblemasService,
    private notificacoesService: NotificacoesService,
    private historicoCorrecoesService: HistoricoCorrecoesProblemasService,
    private historicoRelatosService: HistoricoRelatosService,
  ) { }

  async create(problema: ProblemasType, endereco: EnderecosType, fotos: Array<string>) {
    try {
      await this.prisma.$transaction(async (prisma) => {
        const enderecoCreate = await this.enderecoService.create(endereco);
        const [dia, mes, anoHora] = problema.dedata.split('/');
        const [ano, hora] = anoHora.split(' ');
        const dataFormatada = new Date(`${ano}-${mes}-${dia}T${hora}`);

        const problemaRegistrado = await prisma.problemas.create({
          data: {
            decodigo: randomUUID(),
            dedata: dataFormatada,
            dedescricao: problema.dedescricao,
            decategoria: problema.decategoria,
            delocalizacao: enderecoCreate.edcodigo,
            destatus: 'EM_ANALISE',
            deusuario: problema.deusuario,
          },
          select: {
            deusuario: true,
            decodigo: true,
            categoria: {
              select: {
                cacategoria: true,
              },
            },
          },
        });

        const objFotosProblema: Array<FotosProblemasType> = fotos.map((foto) => {
          return {
            fdfoto: foto,
            fdproblema: problemaRegistrado.decodigo
          }
        })

        objFotosProblema.map(async (fotoProblema: FotosProblemasType) => {
          await this.fotosProblemasService.create(fotoProblema);
        })

        const objNotificacao: NotificacoesType = {
          ntusuario: problemaRegistrado.deusuario,
          ntnotificacao: 'Problema registrado com sucesso! Nossa equipe analisará a solicitação e a encaminhará aos órgãos responsáveis.',
        };

        this.notificacoesService.create(objNotificacao);

        const usuariosMasters = await prisma.usuarios.findMany({
          where: {
            usmaster: true,
          },
          select: {
            uscodigo: true,
          },
        });

        usuariosMasters.map((usuario) => {
          const objNotificacaoNovoRelatoAnalisar: NotificacoesType = {
            ntusuario: usuario.uscodigo,
            ntnotificacao: 'Nova demanda cadastrada!',
            ntlink: 'https://fiscalizaai-front-end.vercel.app/analisarRelatos'
          };

          this.notificacoesService.create(objNotificacaoNovoRelatoAnalisar);
        })
      });

      return { status: true, message: 'Problema cadastrado com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível registrar o problema, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async findLocalizacaoUsuario(body: ConsultaProblemasLocalizacaoUsuarioType) {
    try {
      let problemas;

      await this.prisma.$transaction(async (prisma) => {
        const usuario = await prisma.usuarios.findFirst({
          where: {
            uscodigo: body.uscodigo,
          },
          select: {
            endereco: {
              select: {
                edmunicipio: true,
              }
            },
          },
        });

        problemas = await prisma.problemas.findMany({
          where: {
            AND: [
              {
                OR: [
                  {
                    localizacao: {
                      edmunicipio: usuario.endereco.edmunicipio
                    }
                  },
                  {
                    deusuario: body.uscodigo
                  }
                ]
              },
              {
                destatus: {
                  notIn: ['EM_ANALISE', 'CORRIGIR']
                }
              }
            ]
          },
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
          orderBy: {
            dedata: 'desc'
          }
        });

        problemas = problemas.map(problema => ({
          ...problema,
          isProblemaUsuario: problema.deusuario === body.uscodigo
        }));
      });

      return {
        status: true,
        message: 'Problemas consultados com sucesso!',
        problemas
      };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível realizar a consulta dos problemas, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async findAllUsuario(body: ConsultaProblemasLocalizacaoUsuarioType) {
    try {
      let problemas;

      await this.prisma.$transaction(async (prisma) => {
        problemas = await prisma.problemas.findMany({
          where: {
            deusuario: body.uscodigo
          },
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
                edpontoreferencia: true,
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
            FotosProblemas: {
              select: {
                fdcodigo: true,
                fdfoto: true,
              }
            },
            HistoricoCorrecoesProblemas: {
              select: {
                hcpcodigo: true,
                hcpmotivo: true,
                hcpproblema: true,
                hcpquando: true,
              },
              orderBy: {
                createdAt: 'desc'
              },
            },
            createdAt: true,
            HistoricoRelatos: {
              select: {
                hrcodigo: true,
                hrtratativa: true,
              }
            },
          },
          orderBy: {
            dedata: 'desc'
          }
        });
      });

      return {
        status: true,
        message: 'Problemas consultados com sucesso!',
        problemas
      };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível realizar a consulta dos problemas, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async findProblemasAnalise() {
    try {
      let problemas;

      await this.prisma.$transaction(async (prisma) => {
        problemas = await prisma.problemas.findMany({
          where: {
            destatus: 'EM_ANALISE',
          },
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
                edpontoreferencia: true,
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
            FotosProblemas: {
              select: {
                fdcodigo: true,
                fdfoto: true,
              }
            },
            createdAt: true,
            HistoricoRelatos: {
              select: {
                hrcodigo: true,
                hrtratativa: true,
              }
            },
          },
          orderBy: {
            dedata: 'desc'
          }
        });
      });

      return {
        status: true,
        message: 'Problemas consultados com sucesso!',
        problemas
      };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível realizar a consulta dos problemas, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async findProblemasRevisar(body: ConsultaProblemasLocalizacaoUsuarioType) {
    try {
      let problemas;

      await this.prisma.$transaction(async (prisma) => {
        problemas = await prisma.problemas.findMany({
          where: {
            destatus: 'CORRIGIR',
            deusuario: body.uscodigo,
          },
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
                edpontoreferencia: true,
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
            FotosProblemas: {
              select: {
                fdcodigo: true,
                fdfoto: true,
              }
            },
            HistoricoCorrecoesProblemas: {
              select: {
                hcpcodigo: true,
                hcpmotivo: true,
                hcpproblema: true,
                hcpquando: true,
              },
              orderBy: {
                createdAt: 'desc'
              },
            },
            createdAt: true,
            HistoricoRelatos: {
              select: {
                hrcodigo: true,
                hrtratativa: true,
              }
            },
          },
          orderBy: {
            dedata: 'desc'
          }
        });
      });

      return {
        status: true,
        message: 'Problemas consultados com sucesso!',
        problemas
      };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível realizar a consulta dos problemas, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async findProblemasGeral() {
    try {
      let problemas;

      await this.prisma.$transaction(async (prisma) => {
        problemas = await prisma.problemas.findMany({
          where: {
            destatus: {
              in: ['EM_ANDAMENTO', 'PENDENTE']
            },
          },
          select: {
            decodigo: true,
            decategoria: true,
            dedescricao: true,
            delocalizacao: true,
            dedata: true,
            destatus: true,
            deusuario: true,
            createdAt: true,
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
                edpontoreferencia: true,
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
            FotosProblemas: {
              select: {
                fdcodigo: true,
                fdfoto: true,
              }
            },
            HistoricoRelatos: {
              select: {
                hrcodigo: true,
                hrtratativa: true,
              }
            },
          },
          orderBy: {
            destatus: 'desc'
          }
        });
      });

      return {
        status: true,
        message: 'Problemas consultados com sucesso!',
        problemas
      };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível realizar a consulta dos problemas, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async aprovarReprovarProblema(body: AprovarReprovarProblemaType, usuario: string) {
    try {
      await this.prisma.$transaction(async (prisma) => {
        const usuarioAcao = await prisma.usuarios.findFirst({
          where: {
            usemail: usuario,
          },
          select: {
            uscodigo: true,
            usnome: true,
          },
        });
        const statusProblema = body.status ? 'PENDENTE' : 'CORRIGIR';
        const usuarioProblema = await prisma.problemas.findFirst({
          where: {
            decodigo: body.decodigo,
          },
          select: {
            deusuario: true,
            decodigo: true,
            categoria: {
              select: {
                cacategoria: true,
              },
            },
          },
        });

        await prisma.problemas.update({
          where: {
            decodigo: body.decodigo,
          },
          data: {
            destatus: statusProblema
          },
        });

        if (!body.status) {
          const bodyHistorico: HistoricoCorrecoesProblemasType = {
            hcpproblema: body.decodigo,
            hcpmotivo: body.motivo,
            hcpquando: body.quando
          };

          await this.historicoCorrecoesService.create(bodyHistorico);
        }

        const bodyHistoricoRelatos: HistoricoRelatosType = {
          hrrelato: body.decodigo,
          hrtratativa: `Usuário: ${usuarioAcao.usnome} alterou o status do relato sobre: ${usuarioProblema.categoria.cacategoria} para o status: ${statusProblema}. No dia ${exibirDataHoraAtual()}`,
          hrusuario: usuarioAcao.uscodigo
        };

        await this.historicoRelatosService.create(bodyHistoricoRelatos);

        const objNotificacao: NotificacoesType = {
          ntusuario: usuarioProblema.deusuario,
          ntnotificacao: `Há novidades no seu relato! ${usuarioProblema.categoria.cacategoria}`,
          ntlink: `https://fiscalizaai-front-end.vercel.app/relato/${usuarioProblema.decodigo}`
        };
        this.notificacoesService.create(objNotificacao);
      });

      return {
        status: true,
        message: 'Problema revisado com sucesso!',
      };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível revisar o problema, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async update(data: ProblemasType) {
    try {
      await this.prisma.$transaction(async (prisma) => {
        const municipio = await prisma.municipios.findFirst({
          where: {
            mcmunicipio: data.localizacao.edmunicipio
          },
          select: {
            mccodigo: true
          }
        });

        if (!municipio) {
          throw new HttpException(
            { status: false, error: 'Município não encontrado!' },
            HttpStatus.FORBIDDEN
          );
        }

        const estado = await prisma.estados.findFirst({
          where: {
            esestado: data.localizacao.edestado
          },
          select: {
            escodigo: true
          }
        });

        if (!estado) {
          throw new HttpException(
            { status: false, error: 'Estado não encontrado!' },
            HttpStatus.FORBIDDEN
          );
        }

        await this.enderecoService.update({
          ...data.localizacao,
          edmunicipio: municipio.mccodigo,
          edestado: estado.escodigo
        });

        const problemaUpdate = await prisma.problemas.update({
          where: {
            decodigo: data.decodigo,
          },
          data: {
            dedescricao: data.dedescricao,
            destatus: 'EM_ANALISE'
          },
          select: {
            categoria: {
              select: {
                cacategoria: true,
              },
            },
          },
        });

        await prisma.fotosProblemas.deleteMany({
          where: {
            fdproblema: data.decodigo
          }
        });

        if (data.fotos && data.fotos.length > 0) {
          const objFotosProblema: Array<FotosProblemasType> = data.fotos.map((foto) => ({
            fdfoto: foto.fdfoto,
            fdproblema: data.decodigo
          }));

          await Promise.all(
            objFotosProblema.map(foto => this.fotosProblemasService.create(foto))
          );
        }

        const objNotificacao: NotificacoesType = {
          ntusuario: data.deusuario,
          ntnotificacao: 'Seu relato foi atualizado e está em análise!',
          ntlink: `https://fiscalizaai-front-end.vercel.app/relato/${data.decodigo}`
        };

        await this.notificacoesService.create(objNotificacao);
      });

      return { status: true, message: 'Relato atualizado com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível atualizar o relato, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async findProblema(body: FindProblemaType) {
    try {
      let problema;
      await this.prisma.$transaction(async (prisma) => {
        problema = await prisma.problemas.findFirst({
          where: {
            decodigo: body.decodigo,
          },
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
                edpontoreferencia: true,
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
            FotosProblemas: {
              select: {
                fdcodigo: true,
                fdfoto: true,
              }
            },
            createdAt: true,
          },
        });
      });

      return { status: true, message: 'Relato consultado com sucesso!', problema };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível atualizar o relato, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async cancelarProblema(body: CancelarProblemaType) {
    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.fotosProblemas.deleteMany({
          where: {
            fdproblema: body.decodigo,
          }
        });

        await prisma.historicoCorrecoesProblemas.deleteMany({
          where: {
            hcpproblema: body.decodigo,
          },
        });

        const problemaDeletado = await prisma.problemas.findFirst({
          where: {
            decodigo: body.decodigo,
          },
          select: {
            decodigo: true,
            categoria: {
              select: {
                cacategoria: true,
              },
            },
          },
        });

        await prisma.problemas.deleteMany({
          where: {
            decodigo: body.decodigo,
          },
        });
      });

      return { status: true, message: 'Relato cancelado com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível cancelar o relato, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async atualizarStatusRelato(body: AtualizarStatusRelatoType, usuario: string) {
    try {
      await this.prisma.$transaction(async (prisma) => {
        const usuarioAcao = await prisma.usuarios.findFirst({
          where: {
            usemail: usuario,
          },
          select: {
            uscodigo: true,
            usnome: true,
          },
        });
        const relato = await prisma.problemas.findFirst({
          where: {
            decodigo: body.decodigo,
          },
          select: {
            decodigo: true,
            deusuario: true,
            categoria: {
              select: {
                cacodigo: true,
                cacategoria: true,
              },
            },
          },
        });

        await prisma.problemas.update({
          where: {
            decodigo: body.decodigo,
          },
          data: {
            destatus: body.destatus
          }
        });

        const objNotificacao: NotificacoesType = {
          ntusuario: relato.deusuario,
          ntnotificacao: `Há atualizações referente ao seu relato sobre, ${relato.categoria.cacategoria}`,
          ntlink: `https://fiscalizaai-front-end.vercel.app/relato/${relato.decodigo}`
        };

        this.notificacoesService.create(objNotificacao);

        const bodyHistoricoRelatos: HistoricoRelatosType = {
          hrrelato: body.decodigo,
          hrtratativa: `Usuário: ${usuarioAcao.usnome} alterou o status do relato sobre: ${relato.categoria.cacategoria} para o status: ${body.destatus}. No dia ${exibirDataHoraAtual()}`,
          hrusuario: usuarioAcao.uscodigo
        };

        await this.historicoRelatosService.create(bodyHistoricoRelatos);
      });

      return { status: true, message: 'Relato atualizado com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível atualizar o relato, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async gerarRelatorio(uscodigo: string, categorias: string[], dataInicial?: string, dataFinal?: string) {
    try {
      let problemas;

      await this.prisma.$transaction(async (prisma) => {
        const usuario = await prisma.usuarios.findFirst({
          where: {
            uscodigo: uscodigo,
          },
          select: {
            endereco: {
              select: {
                edmunicipio: true,
              }
            },
          },
        });

        const whereConditions: any = {
          AND: [
            {
              OR: [
                {
                  localizacao: {
                    edmunicipio: usuario.endereco.edmunicipio
                  }
                },
                {
                  deusuario: uscodigo
                }
              ]
            },
            {
              decategoria: {
                in: categorias
              }
            }
          ]
        };

        if (dataInicial && dataFinal) {
          const [anoInicio, mesInicio, diaInicio] = dataInicial.split('-');
          const [anoFim, mesFim, diaFim] = dataFinal.split('-');

          const dataFormatadaInicio = `${anoInicio}-${mesInicio}-${diaInicio}T00:00:00`;
          const dataFormatadaFim = `${anoFim}-${mesFim}-${diaFim}T23:59:00`;

          whereConditions.AND = whereConditions.AND || [];

          whereConditions.AND.push({
            dedata: {
              gte: new Date(dataFormatadaInicio),
              lte: new Date(dataFormatadaFim)
            },
          });
        }

        problemas = await prisma.problemas.findMany({
          where: whereConditions,
          select: {
            decodigo: true,
            decategoria: true,
            dedescricao: true,
            delocalizacao: true,
            dedata: true,
            destatus: true,
            deusuario: true,
            createdAt: true,
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
            FotosProblemas: {
              select: {
                fdcodigo: true,
                fdfoto: true,
              }
            },
            HistoricoCorrecoesProblemas: {
              select: {
                hcpcodigo: true,
                hcpmotivo: true,
                hcpproblema: true,
                hcpquando: true,
              },
              orderBy: {
                createdAt: 'desc'
              },
            },
            HistoricoRelatos: {
              select: {
                hrcodigo: true,
                hrtratativa: true,
              }
            },
          },
          orderBy: {
            dedata: 'desc'
          }
        });

        problemas = problemas.map(problema => ({
          ...problema,
          isProblemaUsuario: problema.deusuario === uscodigo
        }));
      });

      return {
        status: true,
        message: 'Relatório gerado com sucesso!',
        problemas
      };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível gerar o relatório, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async exportarExcel(
    body: ExportarRelatorioType,
    res: Response,
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório');
    const dadosFormatados = body.dados.map((item) => ({
      categoria: item.categoria?.cacategoria || '',
      descricao: item.dedescricao || '',
      data: FormatarDataBrasileira(item.createdAt) || '',
      status: item.destatus || '',
      cep: item.localizacao?.edcep || '',
      rua: item.localizacao?.edrua || '',
      cidade: item.localizacao?.municipio?.mcmunicipio || '',
      estado: item.localizacao?.estado?.essigla || '',
      latitude: item.localizacao?.edlatitude || '',
      longitude: item.localizacao?.edlongitude || '',
    }));

    worksheet.columns = [
      { header: 'Categoria', key: 'categoria', width: 20 },
      { header: 'Descrição', key: 'descricao', width: 30 },
      { header: 'Data', key: 'data', width: 20 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'CEP', key: 'cep', width: 15 },
      { header: 'Rua', key: 'rua', width: 30 },
      { header: 'Cidade', key: 'cidade', width: 20 },
      { header: 'Estado', key: 'estado', width: 10 },
      { header: 'Latitude', key: 'latitude', width: 15 },
      { header: 'Longitude', key: 'longitude', width: 15 },
    ];

    dadosFormatados.forEach((item) => {
      worksheet.addRow(item);
    });

    worksheet.getRow(1).font = { bold: true };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=relatorio-${Date.now()}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}