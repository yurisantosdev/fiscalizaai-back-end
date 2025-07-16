/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FeedbacksUsuariosService } from 'src/services/app.feedbacksUsuarios.service';
import {
  FeedbacksUsuariosType,
  FeedbackUsuarioLerType,
} from 'src/types/FeedbacksUsuariosType';

@Controller()
export class FeedbacksUsuariosController {
  // eslint-disable-next-line prettier/prettier
  constructor(private service: FeedbacksUsuariosService) { }

  @Post('feedback/create')
  async create(@Request() @Body() Body: FeedbacksUsuariosType) {
    return this.service.create(Body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('feedback/findAll')
  async findAll() {
    return this.service.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('feedback/ler')
  async lerFeedback(@Request() @Body() Body: FeedbackUsuarioLerType) {
    return this.service.lerFeedback(Body);
  }
}
