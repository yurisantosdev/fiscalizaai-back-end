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
import { NotificacoesService } from 'src/services/app.notificacoes.service';
import {
  NotificacoesConsultaType,
  NotificacoesType,
} from 'src/types/NotificacoesType';

@Controller()
export class NotificacoesController {
  // eslint-disable-next-line prettier/prettier
  constructor(private service: NotificacoesService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('notificacoes/create')
  async create(@Request() @Body() Body: NotificacoesType) {
    return this.service.create(Body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('notificacoes/findAll')
  async findAll(@Request() @Body() Body: NotificacoesConsultaType) {
    return this.service.findAll(Body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('notificacoes/ler/todas')
  async lerTodas(@Request() @Body() Body: NotificacoesConsultaType) {
    return this.service.lerTodas(Body);
  }
}
