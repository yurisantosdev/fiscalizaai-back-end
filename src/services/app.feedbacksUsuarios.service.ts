/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { FeedbacksUsuariosType, FeedbackUsuarioLerType } from 'src/types/FeedbacksUsuariosType';
import { exibirDataHoraAtual } from 'src/utils/obterDataHoraAtual';
import { NotificacoesType } from 'src/types/NotificacoesType';
import { NotificacoesService } from './app.notificacoes.service';

@Injectable()
export class FeedbacksUsuariosService {
  // eslint-disable-next-line prettier/prettier
  constructor(readonly prisma: PrismaService, private notificacoesService: NotificacoesService) { }

  async create(feedback: FeedbacksUsuariosType) {
    try {
      await this.prisma.$transaction(async (prisma) => {

        await prisma.feedbacksUsuarios.create({
          data: {
            fucodigo: randomUUID(),
            fufeedback: feedback.fufeedback,
            fuquando: exibirDataHoraAtual(),
            fuestrelas: feedback.fuestrelas,
          },
        });

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
            ntnotificacao: 'Nova feedback registrado!',
            ntlink: 'https://fiscalizaai-front-end.vercel.app/feedbacks'
          };

          this.notificacoesService.create(objNotificacaoNovoRelatoAnalisar);
        })
      });

      return { status: true, message: 'Feedback cadastrado com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível criar o feedback, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async findAll() {
    try {
      let feedbacks;

      await this.prisma.$transaction(async (prisma) => {
        feedbacks = await prisma.feedbacksUsuarios.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        });
      });

      return {
        status: true,
        message: 'Feedbacks consultadas com sucesso!',
        feedbacks
      };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível consultar os Feedbacks, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async lerFeedback(feedback: FeedbackUsuarioLerType) {
    try {
      await this.prisma.$transaction(async (prisma) => {

        await prisma.feedbacksUsuarios.update({
          where: {
            fucodigo: feedback.fucodigo
          },
          data: {
            fulido: true,
          },
        });
      });

      return { status: true, message: 'Feedback lido com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível ler o feedback, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }
}
