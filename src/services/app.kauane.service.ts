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
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const response = await client.responses.create({
        model: "gpt-4.1",
        input: mensagem
      });

      return { status: true, message: response.output_text };
    } catch (error) {
      console.log(error)
      throw new HttpException({ status: false, error }, HttpStatus.FORBIDDEN);
    }
  }
}
