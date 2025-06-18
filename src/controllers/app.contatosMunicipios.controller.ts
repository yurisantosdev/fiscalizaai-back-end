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
import { ContatosMunicipiosService } from 'src/services/app.contatosMunicipios.service';
import { ContatosMunicipiosType } from 'src/types/ContatosMunicipios';

@Controller()
export class ContatosMunicipiosController {
  // eslint-disable-next-line prettier/prettier
  constructor(private service: ContatosMunicipiosService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('contatos/municipios/create')
  async create(@Request() @Body() Body: ContatosMunicipiosType) {
    return this.service.create(Body);
  }
}
