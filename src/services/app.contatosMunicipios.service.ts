/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { ContatosMunicipiosType } from 'src/types/ContatosMunicipios';

@Injectable()
export class ContatosMunicipiosService {
  // eslint-disable-next-line prettier/prettier
  constructor(readonly prisma: PrismaService) { }

  async create(contato: ContatosMunicipiosType) {
    try {
      await this.prisma.$transaction(async (prisma) => {

        await prisma.contatosMunicipio.create({
          data: {
            cmcodigo: randomUUID(),
            cmcontato: contato.cmcontato,
            cmdescricao: contato.cmdescricao,
            cmmunicipio: contato.cmmunicipio,
          },
        });
      });

      return { status: true, message: 'Contato cadastrado com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível criar o contato, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }
}
