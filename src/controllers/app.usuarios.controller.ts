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
import { UsuarioService } from '../services/app.usuarios.service';
import { AuthGuard } from '@nestjs/passport';
import {
  CriarUsuario,
  EsqueciSenhaType,
  RedefinirSenhaType,
  TrocaSenhaType,
  UsuarioType,
} from 'src/types/UsuariosType';

@Controller()
export class UsuariosController {
  // eslint-disable-next-line prettier/prettier
  constructor(private usuarioService: UsuarioService) { }

  // @UseGuards(AuthGuard('jwt'))
  @Post('usuarios/create')
  async create(@Request() @Body() Body: CriarUsuario) {
    return this.usuarioService.create(Body.usuario, Body.endereco);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('usuarios/update')
  async update(@Request() @Body() Body: UsuarioType) {
    return this.usuarioService.update(Body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('usuarios/find/:uscodigo')
  async find(@Param('uscodigo') uscodigo: string) {
    return this.usuarioService.find(uscodigo);
  }

  @Post('usuarios/solicitar/recuperacao/senha')
  async solicitarRecuperacaoSenha(@Body() Body: EsqueciSenhaType) {
    return this.usuarioService.solicitarRecuperacaoSenha(Body);
  }

  @Post('usuarios/solicitar/redefinir/senha')
  async redefinirSenha(@Body() Body: RedefinirSenhaType) {
    return this.usuarioService.redefinirSenha(Body);
  }

  @Post('usuarios/trocar/senha')
  async trocaeSenha(@Body() Body: TrocaSenhaType) {
    return this.usuarioService.trocaSenha(Body);
  }
}
