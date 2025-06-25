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
import { HistoricoRelatosService } from 'src/services/app.historicoRelatos.service';
import { HistoricoRelatosType } from 'src/types/HistoricoRelatosType';

@Controller()
export class HistoricoRelatosController {
  // eslint-disable-next-line prettier/prettier
  constructor(private service: HistoricoRelatosService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('historico/relatos/create')
  async create(@Request() @Body() Body: HistoricoRelatosType) {
    return this.service.create(Body);
  }
}
