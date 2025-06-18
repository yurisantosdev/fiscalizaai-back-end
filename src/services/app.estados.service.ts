/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { EstadosType } from 'src/types/EstadosType';
import axios from 'axios';

@Injectable()
export class EstadosService {
  // eslint-disable-next-line prettier/prettier
  constructor(readonly prisma: PrismaService) { }

  async create(estado: EstadosType) {
    try {
      await this.prisma.$transaction(async (prisma) => {

        await prisma.estados.create({
          data: {
            escodigo: randomUUID(),
            esestado: estado.esestado,
            essigla: estado.essigla,
          },
        });
      });

      return { status: true, message: 'Estado cadastrado com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível criar o estado, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async sincronizarEstadosIBGE() {
    try {
      const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
      const estadosIBGE = response.data;

      const estadosCadastrados = await this.prisma.estados.findMany();

      const estadosPorSigla = new Map(
        estadosCadastrados.map(estado => [estado.essigla, estado])
      );

      for (const estadoIBGE of estadosIBGE) {
        const sigla = estadoIBGE.sigla;
        const nome = estadoIBGE.nome;

        const estadoExistente = estadosPorSigla.get(sigla);

        if (estadoExistente) {
          if (estadoExistente.esestado !== nome) {
            await this.prisma.estados.update({
              where: { escodigo: estadoExistente.escodigo },
              data: { esestado: nome }
            });
          }
        } else {
          await this.prisma.estados.create({
            data: {
              escodigo: randomUUID(),
              esestado: nome,
              essigla: sigla,
            }
          });
        }
      }

      return {
        status: true,
        message: 'Estados sincronizados com sucesso!'
      };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível sincronizar os estados, por favor tente novamente!';

      throw new HttpException(
        { status: false, error: errorMessage },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
