/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FiscalizaAIService } from 'src/services/app.fiscalizaAI.service';

@Controller()
export class FiscalizaAIController {
  // eslint-disable-next-line prettier/prettier
  constructor(private service: FiscalizaAIService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('fiscalizaAI/chat')
  async chat(
    @Request() req,
    @Body()
    body: {
      mensagem: string;
      historico?: { autor: 'user' | 'gpt'; texto: string }[];
    },
  ) {
    const usuario = req.user;
    return this.service.chat(body.mensagem, usuario.user, body.historico || []);
  }
}
