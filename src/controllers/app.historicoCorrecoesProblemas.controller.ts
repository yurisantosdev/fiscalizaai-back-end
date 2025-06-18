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
import { HistoricoCorrecoesProblemasService } from 'src/services/app.historicoCorrecoesProblemas.service';
import { HistoricoCorrecoesProblemasType } from 'src/types/HistoricoCorrecoesProblemasType';

@Controller()
export class HistoricoCorrecoesProblemasController {
  // eslint-disable-next-line prettier/prettier
  constructor(private service: HistoricoCorrecoesProblemasService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('problemas/create')
  async create(@Request() @Body() Body: HistoricoCorrecoesProblemasType) {
    return this.service.create(Body);
  }
}
