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
import { MunicipiosService } from 'src/services/app.municipios.service';
import { MunicipiosType } from 'src/types/MunicipiosType';

@Controller()
export class MunicipiosController {
  // eslint-disable-next-line prettier/prettier
  constructor(private service: MunicipiosService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('municipios/create')
  async create(@Request() @Body() Body: MunicipiosType) {
    return this.service.create(Body);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get('municipios/sincronizar/IBGE')
  async sincronizarMunicipiosIBGE() {
    return this.service.sincronizarMunicipiosIBGE();
  }
}
