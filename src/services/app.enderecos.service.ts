/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { EnderecosType } from 'src/types/EnderecosType';

@Injectable()
export class EnderecosService {
  // eslint-disable-next-line prettier/prettier
  constructor(readonly prisma: PrismaService) { }

  async create(endereco: EnderecosType) {
    try {
      let enderecoCreate: any;
      await this.prisma.$transaction(async (prisma) => {
        const municipio = await prisma.municipios.findFirst({
          where: {
            mcmunicipio: endereco.edmunicipio,
          },
          select: {
            mccodigo: true,
          }
        });

        const estado = await prisma.estados.findFirst({
          where: {
            OR: [
              { esestado: endereco.edestado },
              { essigla: endereco.edestado }
            ]
          },
          select: {
            escodigo: true,
          }
        });

        if (!estado) {
          throw new HttpException(
            { status: false, error: 'Estado não encontrado' },
            HttpStatus.NOT_FOUND
          );
        }

        enderecoCreate = await prisma.enderecos.create({
          data: {
            edcodigo: randomUUID(),
            edbairro: endereco.edbairro,
            edcep: endereco.edcep,
            edcomplemento: endereco.edcomplemento,
            ednumero: endereco.ednumero,
            edrua: endereco.edrua,
            edestado: estado.escodigo,
            edmunicipio: municipio.mccodigo,
            edlatitude: endereco.edlatitude,
            edlongitude: endereco.edlongitude,
            edproblema: endereco.edproblema,
            edpontoreferencia: endereco.edpontoreferencia
          },
        });
      });

      return { status: true, message: 'Endereço cadastrado com sucesso!', edcodigo: enderecoCreate.edcodigo };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível criar o endereço, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async update(endereco: EnderecosType) {
    try {
      await this.prisma.enderecos.update({
        where: {
          edcodigo: endereco.edcodigo,
        },
        data: {
          edrua: endereco.edrua,
          edestado: endereco.edestado,
          edmunicipio: endereco.edmunicipio,
          ednumero: endereco.ednumero,
          edcomplemento: endereco.edcomplemento,
          edcep: endereco.edcep,
          edbairro: endereco.edbairro,
          edlatitude: endereco.edlatitude,
          edlongitude: endereco.edlongitude,
          edpontoreferencia: endereco.edpontoreferencia
        },
      });

      return { status: true, message: 'Endereço atualizado com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível atualizar o endereço, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }
}
