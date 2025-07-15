/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import OpenAI from "openai";
import { ProblemasServices } from './app.problemas.service';

@Injectable()
export class KauaneService {
  // eslint-disable-next-line prettier/prettier
  constructor(readonly prisma: PrismaService, private serviceProblemas: ProblemasServices) { }

  async chat(mensagem: string, usuario: string, historico: { autor: 'user' | 'gpt', texto: string }[] = []) {
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      let promptFinal = mensagem;

      const usuarioAcao = await this.prisma.usuarios.findFirst({
        where: { usemail: usuario },
        select: { uscodigo: true, usnome: true },
      });
      const relatos = await this.serviceProblemas.findLocalizacaoUsuario({ uscodigo: usuarioAcao.uscodigo });

      if (relatos.problemas.length > 0) {
        const contexto = relatos.problemas
          .map((relato: any, index: number) => {
            const {
              dedescricao,
              localizacao,
              categoria,
              dedata,
              destatus
            } = relato;
            const {
              edbairro,
              edrua,
              ednumero,
              edcep,
              edcomplemento,
              edlatitude,
              edlongitude,
              municipio,
              estado
            } = localizacao;

            return `Relato ${index + 1}:
              - Problema: ${dedescricao}
              - Localização: ${edrua}, Nº ${ednumero}, Bairro ${edbairro}, CEP ${edcep}${edcomplemento ? `, Complemento: ${edcomplemento}` : ''}.
                Coordenadas: [${edlatitude}, ${edlongitude}]
                Cidade: ${municipio.mcmunicipio} - ${estado.esestado}
              - Categoria: ${categoria.cacategoria} (${categoria.cadescricao})
              - Data de registro: ${dedata}
              - Status: ${destatus}\n`;
          })
          .join('\n');

        promptFinal = `
          Você é um assistente inteligente que responde com base em relatos públicos registrados por cidadãos.
          Abaixo estão os relatos de problemas recebidos:
          ${contexto}
          Com base nas informações acima, responda à seguinte pergunta do usuário de forma clara, objetiva e contextualizada:
          Pergunta: ${mensagem}
          `.trim();

      } else {
        return {
          status: false,
          message: 'Não temos dados suficientes, por favor espere a população realizar mais relatos.'
        };
      }

      let inputFinal = '';
      if (historico && historico.length > 0) {
        inputFinal = historico.map(msg => `${msg.autor === 'user' ? 'Usuário' : 'Kauane'}: ${msg.texto}`).join('\n') + `\nUsuário: ${promptFinal}`;
      } else {
        inputFinal = promptFinal;
      }

      const response = await client.responses.create({
        model: "gpt-4.1",
        input: inputFinal,
        prompt: {
          id: "pmpt_686fc6e0ff788193a0a575eec80b290d094b18991c9d9d23",
          version: "9"
        }
      });

      return {
        status: true,
        message: response.output_text
      };
    } catch (error) {
      throw new HttpException(
        { status: false, error },
        HttpStatus.FORBIDDEN
      );
    }
  }
}
