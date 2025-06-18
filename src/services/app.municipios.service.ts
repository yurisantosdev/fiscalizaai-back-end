/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { MunicipiosType } from 'src/types/MunicipiosType';
import axios from 'axios';

@Injectable()
export class MunicipiosService {
  // eslint-disable-next-line prettier/prettier
  constructor(readonly prisma: PrismaService) { }

  async create(municipio: MunicipiosType) {
    try {
      await this.prisma.$transaction(async (prisma) => {

        await prisma.municipios.create({
          data: {
            mccodigo: randomUUID(),
            mcmunicipio: municipio.mcmunicipio,
            mcestado: municipio.mcestado,
            mclatitude: municipio.mclatitude,
            mclongitude: municipio.mclongitude,
          },
        });
      });

      return { status: true, message: 'Município cadastrado com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível criar o município, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async sincronizarMunicipiosIBGE() {
    try {
      const estadosCadastrados = await this.prisma.estados.findMany();

      const municipiosCadastrados = await this.prisma.municipios.findMany();
      const municipiosPorNomeEstado = new Map(
        municipiosCadastrados.map(municipio => [`${municipio.mcmunicipio}-${municipio.mcestado}`, municipio])
      );

      let totalAtualizados = 0;
      let totalCriados = 0;

      for (const estado of estadosCadastrados) {
        try {
          const response = await axios.get(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado.essigla}/municipios`
          );

          const municipiosIBGE = response.data;

          for (const municipioIBGE of municipiosIBGE) {
            const nomeMunicipio = municipioIBGE.nome;
            const chave = `${nomeMunicipio}-${estado.escodigo}`;
            const municipioExistente = municipiosPorNomeEstado.get(chave);

            let lat = null;
            let lon = null;

            try {
              const geoResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                  q: `${nomeMunicipio}, ${estado.esestado}, Brasil`,
                  format: 'json',
                  limit: 1
                },
                headers: {
                  'User-Agent': 'SeuApp/1.0 (email@dominio.com)'
                }
              });

              if (geoResponse.data.length > 0) {
                lat = parseFloat(geoResponse.data[0].lat);
                lon = parseFloat(geoResponse.data[0].lon);
              }
            } catch (geoError) {
              console.warn(`Não foi possível obter coordenadas de ${nomeMunicipio}-${estado.esestado}`);
            }

            if (municipioExistente) {
              await this.prisma.municipios.update({
                where: { mccodigo: municipioExistente.mccodigo },
                data: {
                  mcmunicipio: nomeMunicipio,
                  mclatitude: lat,
                  mclongitude: lon
                }
              });
              totalAtualizados++;
            } else {
              await this.prisma.municipios.create({
                data: {
                  mccodigo: randomUUID(),
                  mcmunicipio: nomeMunicipio,
                  mcestado: estado.escodigo,
                  mclatitude: lat,
                  mclongitude: lon
                }
              });
              totalCriados++;
            }
          }
        } catch (error) {
          console.error(`Erro ao processar municípios do estado ${estado.esestado}:`, error);
          continue;
        }
      }

      return {
        status: true,
        message: 'Municípios sincronizados com sucesso!',
        totalAtualizados,
        totalCriados
      };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível sincronizar os municípios, por favor tente novamente!';

      throw new HttpException(
        { status: false, error: errorMessage },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}



