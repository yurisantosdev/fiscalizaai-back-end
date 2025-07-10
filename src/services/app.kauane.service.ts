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

      const pedeRelatos = /relatos|problemas|mais afetados|localiza(c|ç)ão|localizacoes|localizações|principais|frequentes|comuns|resumo|lista/i.test(mensagem);

      let promptFinal = mensagem;

      if (pedeRelatos) {
        const usuarioAcao = await this.prisma.usuarios.findFirst({
          where: { usemail: usuario },
          select: { uscodigo: true, usnome: true },
        });
        const relatos = await this.serviceProblemas.findLocalizacaoUsuario({ uscodigo: usuarioAcao.uscodigo });
        const contexto = relatos.problemas
          .map((relato: any, index: number) => {
            const { dedescricao, localizacao, categoria } = relato;
            const { edbairro, edrua, ednumero, edcep, edcomplemento, edlatitude, edlongitude, edpontoreferencia, municipio, estado } = localizacao;
            return `${index + 1}. Problema: ${dedescricao} | Local: ${edrua}, ${edbairro}, ${ednumero}, ${edcep}, ${edcomplemento}, ${edlatitude}, ${edlongitude}, ${edpontoreferencia}, ${municipio.mcmunicipio} - ${estado.esestado} | Categoria: ${categoria.cacategoria}, Data de registro: ${relato.dedata}, Status: ${relato.destatus}`;
          })
          .join('\n');
        promptFinal = `Com base nos relatos a seguir, responda à pergunta do usuário de forma clara e objetiva:\n\n${contexto}\n\nPergunta: ${mensagem}`;
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
          version: "7"
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
