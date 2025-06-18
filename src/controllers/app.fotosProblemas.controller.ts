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
import { FotosProblemasService } from 'src/services/app.fotosProblemas.service';
import { FotosProblemasType } from 'src/types/FontosProblemasType';

@Controller()
export class FotosProblemasController {
  // eslint-disable-next-line prettier/prettier
  constructor(private service: FotosProblemasService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('fotos/problemas/create')
  async create(@Request() @Body() Body: FotosProblemasType) {
    return this.service.create(Body);
  }
}
