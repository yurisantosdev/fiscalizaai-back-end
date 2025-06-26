/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Body,
  Controller,
  Get,
  Param,
  Res,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProblemasServices } from 'src/services/app.problemas.service';
import {
  AprovarReprovarProblemaType,
  AtualizarStatusRelatoType,
  CancelarProblemaType,
  ConsultaProblemasLocalizacaoUsuarioType,
  ExportarRelatorioType,
  FindProblemaType,
  ProblemasCriateType,
  ProblemasType,
} from 'src/types/ProblemasType';
import { Response } from 'express';
@Controller()
export class ProblemasController {
  // eslint-disable-next-line prettier/prettier
  constructor(private service: ProblemasServices) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('problemas/create')
  async create(@Request() req, @Request() @Body() Body: ProblemasCriateType) {
    return this.service.create(Body.problemas, Body.endereco, Body.fotos);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('problemas/find/localizacao/usuario')
  async findLocalizacaoUsuario(
    @Request() @Body() Body: ConsultaProblemasLocalizacaoUsuarioType,
  ) {
    return this.service.findLocalizacaoUsuario(Body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('problemas/find/all/usuario')
  async findAllUsuario(
    @Request() @Body() Body: ConsultaProblemasLocalizacaoUsuarioType,
  ) {
    return this.service.findAllUsuario(Body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('problemas/find/analisar')
  async findProblemasAnalise() {
    return this.service.findProblemasAnalise();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('problemas/revisar')
  async findProblemasRevisar(
    @Body() Body: ConsultaProblemasLocalizacaoUsuarioType,
  ) {
    return this.service.findProblemasRevisar(Body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('problemas/geral')
  async findProblemasGeral() {
    return this.service.findProblemasGeral();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('problemas/analisar')
  async aprovarReprovarProblema(
    @Request() req,
    @Request() @Body() Body: AprovarReprovarProblemaType,
  ) {
    const usuario = req.user;
    return this.service.aprovarReprovarProblema(Body, usuario.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('problemas/ajustar')
  async updateProblema(@Request() @Body() Body: ProblemasType) {
    return this.service.update(Body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('problemas/cancelar')
  async cancelarProblema(@Request() @Body() Body: CancelarProblemaType) {
    return this.service.cancelarProblema(Body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('problemas/atualizar/status')
  async atualizarStatusRelato(
    @Request() req,
    @Request() @Body() Body: AtualizarStatusRelatoType,
  ) {
    const usuario = req.user;
    return this.service.atualizarStatusRelato(Body, usuario.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('problemas/relatorio')
  async gerarRelatorio(
    @Request() req,
    @Body()
    body: { categorias: string[]; dataInicial?: string; dataFinal?: string },
  ) {
    return this.service.gerarRelatorio(
      req.user.uscodigo,
      body.categorias,
      body.dataInicial,
      body.dataFinal,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('problemas/find')
  async findProblema(@Request() @Body() Body: FindProblemaType) {
    return this.service.findProblema(Body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('problemas/excel')
  async exportarExcel(
    @Body() Body: ExportarRelatorioType,
    @Res() res: Response,
  ) {
    await this.service.exportarExcel(Body, res);
  }
}
