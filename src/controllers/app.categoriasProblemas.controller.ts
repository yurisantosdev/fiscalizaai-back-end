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
import { CategoriasProblemasServices } from 'src/services/app.categoriasProblemas.service';
import { CategoriasProblemasType } from 'src/types/CategoriasProblemasType';

@Controller()
export class CategoriasProblemasController {
  // eslint-disable-next-line prettier/prettier
  constructor(private service: CategoriasProblemasServices) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('categorias/problemas/create')
  async create(@Request() @Body() Body: CategoriasProblemasType) {
    return this.service.create(Body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('categorias/problemas/update')
  async update(@Request() @Body() Body: CategoriasProblemasType) {
    return this.service.update(Body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('categorias/problemas/desativar/ativar')
  async desativarAtivar(@Request() @Body() Body: CategoriasProblemasType) {
    return this.service.desativarAtivar(Body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('categorias/problemas/findAll')
  async findAll() {
    return this.service.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('categorias/problemas/findAllAtivas')
  async findAllAtivas() {
    return this.service.findAllAtivas();
  }
}
