/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import OpenAI from "openai";

@Injectable()
export class KauaneService {
  // eslint-disable-next-line prettier/prettier
  constructor(readonly prisma: PrismaService) { }

  async chat(mensagem: string) {
    try {
      console.log('Antes carregar o OpenAI');

      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      console.log('Antes de chamar o GPT');

      const response = await client.responses.create({
        model: "gpt-4.1",
        input: mensagem
      });

      console.log(response.output_text);

      return { status: true, message: response.output_text };
    } catch (error) {
      console.log(error)
      throw new HttpException({ status: false, error }, HttpStatus.FORBIDDEN);
    }
  }
}
