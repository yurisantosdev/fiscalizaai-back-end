/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { HistoricoCorrecoesProblemasType } from 'src/types/HistoricoCorrecoesProblemasType';

@Injectable()
export class HistoricoCorrecoesProblemasService {
  // eslint-disable-next-line prettier/prettier
  constructor(readonly prisma: PrismaService) { }

  async create(historico: HistoricoCorrecoesProblemasType) {
    try {
      await this.prisma.$transaction(async (prisma) => {

        await prisma.historicoCorrecoesProblemas.create({
          data: {
            hcpcodigo: randomUUID(),
            hcpmotivo: historico.hcpmotivo,
            hcpquando: historico.hcpquando,
            hcpproblema: historico.hcpproblema,
          },
        });
      });

      return { status: true, message: 'Histórico para correção do problema, cadastrado com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível registrar o histórico para correção do problema, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }
}
