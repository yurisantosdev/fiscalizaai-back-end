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
import { KauaneService } from 'src/services/app.kauane.service';

@Controller()
export class KauaneController {
  // eslint-disable-next-line prettier/prettier
  constructor(private service: KauaneService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('kauane/chat')
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
