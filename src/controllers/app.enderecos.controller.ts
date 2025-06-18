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
import { EnderecosService } from 'src/services/app.enderecos.service';
import { EnderecosType } from 'src/types/EnderecosType';

@Controller()
export class EnderecosController {
  // eslint-disable-next-line prettier/prettier
  constructor(private service: EnderecosService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('enderecos/create')
  async create(@Request() @Body() Body: EnderecosType) {
    return this.service.create(Body);
  }
}
