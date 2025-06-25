/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { FotosProblemasType } from 'src/types/FontosProblemasType';

@Injectable()
export class FotosProblemasService {
  // eslint-disable-next-line prettier/prettier
  constructor(readonly prisma: PrismaService) { }

  async create(foto: FotosProblemasType) {
    try {
      console.log('Foto Selecionada:' + foto.fdfoto)
      console.log('Foto problema:' + foto.fdproblema)

      await this.prisma.fotosProblemas.create({
        data: {
          fdcodigo: randomUUID(),
          fdfoto: foto.fdfoto,
          fdproblema: foto.fdproblema,
        },
      });

      return { status: true, message: 'Foto cadastrada com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível criar a foto, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }
}
