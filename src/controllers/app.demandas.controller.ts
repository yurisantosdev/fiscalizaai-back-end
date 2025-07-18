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
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DemandasService } from 'src/services/app.demandas.service';
import { DemandasCreateType, DemandasUpdateType } from 'src/types/DemandasType';

@Controller()
export class DemandasController {
  // eslint-disable-next-line prettier/prettier
  constructor(private service: DemandasService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('demandas/create')
  async create(@Request() @Body() Body: DemandasCreateType) {
    return this.service.create(Body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('demandas/update')
  async update(@Request() @Body() Body: DemandasUpdateType) {
    return this.service.update(Body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('demandas/findAll')
  async findAll() {
    return this.service.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('demandas/find/:dmcodigo')
  async find(@Param('dmcodigo') dmcodigo: string) {
    return this.service.find(dmcodigo);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('demandas/delete/:dmcodigo')
  async delete(@Param('dmcodigo') dmcodigo: string) {
    return this.service.delete(dmcodigo);
  }
}
