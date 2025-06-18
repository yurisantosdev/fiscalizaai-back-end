/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { RecuperacaoSenhaType } from 'src/types/UsuariosType';

@Injectable()
export class CodigosRecuperacaoSenhasServices {
  // eslint-disable-next-line prettier/prettier
  constructor(readonly prisma: PrismaService) { }

  async create(body: RecuperacaoSenhaType) {
    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.codigosRecuperacaoSenhas.deleteMany({
          where: {
            crsusuario: body.uscodigo,
          }
        });

        await prisma.codigosRecuperacaoSenhas.create({
          data: {
            crscodigo: randomUUID(),
            crscodigorecuperacao: body.codigo,
            crsusuario: body.uscodigo,
          },
        });
      });

      return { status: true, message: 'Codigo cadastrado com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível cadastrar o codigo, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }
}
