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
import { EstadosService } from 'src/services/app.estados.service';
import { EstadosType } from 'src/types/EstadosType';

@Controller()
export class EstadosController {
  // eslint-disable-next-line prettier/prettier
  constructor(private service: EstadosService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('estados/create')
  async create(@Request() @Body() Body: EstadosType) {
    return this.service.create(Body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('estados/sincronizar/IBGE')
  async sincronizarEstadosIBGE() {
    return this.service.sincronizarEstadosIBGE();
  }
}
