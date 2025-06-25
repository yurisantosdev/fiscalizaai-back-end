/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { HistoricoRelatosType } from 'src/types/HistoricoRelatosType';

@Injectable()
export class HistoricoRelatosService {
  // eslint-disable-next-line prettier/prettier
  constructor(readonly prisma: PrismaService) { }

  async create(historico: HistoricoRelatosType) {
    try {
      await this.prisma.historicoRelatos.create({
        data: {
          hrcodigo: randomUUID(),
          hrtratativa: historico.hrtratativa,
          hrrelato: historico.hrrelato,
          hrusuario: historico.hrusuario,
        },
      });

      return { status: true, message: 'Histórico cadastrado com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível criar o histórico, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }
}
