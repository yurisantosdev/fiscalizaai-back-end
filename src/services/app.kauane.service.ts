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

  private verificaSePedeRelatos(mensagemOriginal: string): boolean {
    const mensagem = mensagemOriginal
      .normalize("NFD") // remove acentos
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    const regexRelatos = new RegExp(
      [
        // CATEGORIAS E TIPOS
        'categorias?', 'classificac(?:ao|oes)', 'tipos? de problemas?', 'tipos?', 'setores?',
        'temas?', 'assuntos?', 'departamentos?', 'areas? da gestao', 'natureza do problema',

        // STATUS DO RELATO
        'status', 'situac(?:ao|oes)', 'resolvido(?:s)?', 'nao resolvido(?:s)?',
        'pendentes?', 'em andamento', 'finalizado(?:s)?', 'sem resposta', 'aguardando solucao',

        // RELATOS GERAIS
        'relatorios?', 'relatos?', 'problemas?', 'reclamac(?:ao|oes)?', 'denuncias?',
        'principais', 'frequentes', 'mais afetados?', 'locais? problematicos?',
        'locais? criticos?', 'resumo', 'lista', 'mapa de problemas', 'diagnostico', 'panorama',

        // TEMAS URBANOS E INFRA
        'buracos?', 'asfalto', 'pavimentac(?:ao)?', 'calcadas?', 'obras?', 'infraestrutura',
        'lixo', 'coleta', 'entulho', 'sujeira', 'esgoto', 'alagamentos?',
        'iluminac(?:ao)?', 'poste(?:s)?', 'luz(?:es)? queimada(?:s)?',
        'transporte', 'onibus', 'ponto(?:s)? de onibus', 'transito', 'faixa de pedestre',
        'escolas?', 'postos? de saude', 'creches?', 'medicos?', 'vagas?',

        // LOCALIZAÇÃO GEOGRÁFICA
        'latitude', 'longitude', 'onde (fica|estao|estao localizados)', 'quais (bairros?|ruas?)',
        'locais? (afetados|criticos|com problemas)', 'enderecos?', 'enderecos? afetados?',
        'regioes?', 'zonas? (norte|sul|leste|oeste)', 'mapa', 'proximidades?',
        'perto de (mim|minha casa|onde moro)', 'localizacao', 'localizacoes',
        'local', 'bairro(?:s)?', 'cidade', 'zona urbana', 'area afetada', 'pontos? problematicos?'
      ].join('|'),
      'i'
    );

    return regexRelatos.test(mensagem);
  }

  async chat(mensagem: string, usuario: string, historico: { autor: 'user' | 'gpt', texto: string }[] = []) {
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const pedeRelatos = this.verificaSePedeRelatos(mensagem);

      let promptFinal = mensagem;

      if (pedeRelatos) {
        const usuarioAcao = await this.prisma.usuarios.findFirst({
          where: { usemail: usuario },
          select: { uscodigo: true, usnome: true },
        });
        const relatos = await this.serviceProblemas.findLocalizacaoUsuario({ uscodigo: usuarioAcao.uscodigo });

        if (relatos.problemas.length > 0) {
          const contexto = relatos.problemas
            .map((relato: any, index: number) => {
              const { dedescricao, localizacao, categoria } = relato;
              const { edbairro, edrua, ednumero, edcep, edcomplemento, edlatitude, edlongitude, edpontoreferencia, municipio, estado } = localizacao;
              return `${index + 1}. Problema: ${dedescricao} | Local: ${edrua}, ${edbairro}, ${ednumero}, ${edcep}, ${edcomplemento}, ${edlatitude}, ${edlongitude}, ${edpontoreferencia}, ${municipio.mcmunicipio} - ${estado.esestado} | Categoria: ${categoria.cacategoria}, Data de registro: ${relato.dedata}, Status: ${relato.destatus}`;
            })
            .join('\n');
          promptFinal = `Com base nos relatos a seguir, responda à pergunta do usuário de forma clara e objetiva:\n\n${contexto}\n\nPergunta: ${mensagem}`;
        } else {
          return {
            status: false,
            message: 'Não temos dados suficientes, por favor espere a população realizar mais relatos.'
          };
        }
      }

      if (!pedeRelatos) {
        return {
          status: false,
          message: 'Desculpe, não tenho dados suficientes para responder a essa pergunta. Por favor, tente perguntar sobre problemas, relatos ou situações urbanas específicas.'
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
