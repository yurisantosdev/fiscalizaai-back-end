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
import { FeaturesService } from 'src/services/app.features.service';
import { FeaturesCreateType } from 'src/types/FeaturesType';

@Controller()
export class FeaturesController {
  // eslint-disable-next-line prettier/prettier
  constructor(private service: FeaturesService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('features/create')
  async create(@Request() @Body() Body: FeaturesCreateType) {
    return this.service.create(Body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('features/find/:ftcodigo')
  async find(@Param('ftcodigo') ftcodigo: string) {
    return this.service.find(ftcodigo);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('features/findAll')
  async findAll() {
    return this.service.findAll();
  }
}
