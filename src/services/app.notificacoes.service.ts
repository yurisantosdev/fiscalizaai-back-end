/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { NotificacoesConsultaType, NotificacoesType } from 'src/types/NotificacoesType';

@Injectable()
export class NotificacoesService {
  // eslint-disable-next-line prettier/prettier
  constructor(readonly prisma: PrismaService) { }

  async create(notificacao: NotificacoesType) {
    try {
      await this.prisma.$transaction(async (prisma) => {

        await prisma.notificacoes.create({
          data: {
            ntcodigo: randomUUID(),
            ntnotificacao: notificacao.ntnotificacao,
            ntusuario: notificacao.ntusuario,
            ntlink: notificacao.ntlink
          },
        });
      });

      return { status: true, message: 'Notificação cadastrado com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível criar o notificação, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async findAll(body: NotificacoesConsultaType) {
    try {
      let notificacoes;
      let naoLidas;

      await this.prisma.$transaction(async (prisma) => {
        notificacoes = await prisma.notificacoes.findMany({
          where: {
            usuario: {
              uscodigo: body.uscodigo
            }
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        naoLidas = await prisma.notificacoes.findMany({
          where: {
            usuario: {
              uscodigo: body.uscodigo,
            },
            ntlida: false,
          },
        });
      });

      return {
        status: true,
        message: 'Notificações consultadas com sucesso!',
        notificacoes: {
          todas: notificacoes,
          naoLidas: naoLidas
        }
      };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível consultar as notificações, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async lerTodas(body: NotificacoesConsultaType) {
    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.notificacoes.updateMany({
          where: {
            usuario: {
              uscodigo: body.uscodigo
            }
          },
          data: {
            ntlida: true,
          }
        });
      });

      return {
        status: true, message: 'Notificações lidas com sucesso!'
      };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível ler todas as notificações, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }
}
