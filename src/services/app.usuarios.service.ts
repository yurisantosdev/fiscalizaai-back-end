/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { EsqueciSenhaType, RecuperacaoSenhaType, RedefinirSenhaType, TrocaSenhaType, UsuarioType } from 'src/types/UsuariosType';
import * as bcrypt from 'bcrypt';
import { EnderecosType } from 'src/types/EnderecosType';
import { EnderecosService } from './app.enderecos.service';
import * as nodemailer from 'nodemailer';
import { CodigosRecuperacaoSenhasServices } from './app.codigosRecuperacaoSenhas.service';

const saltOrRounds = 10;

@Injectable()
export class UsuarioService {
  // eslint-disable-next-line prettier/prettier
  constructor(readonly prisma: PrismaService, private enderecoService: EnderecosService, private codigosRecuperacaoSenhasServices: CodigosRecuperacaoSenhasServices) { }

  private async enviarEmail(destinatario: string) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const user = await this.prisma.usuarios.findFirst({
      where: {
        usemail: destinatario,
      },
      select: {
        uscodigo: true,
        usnome: true,
      },
    });

    const codigoRecuperacao = Math.floor(100000 + Math.random() * 900000).toString();
    const objRecuperarSenha: RecuperacaoSenhaType = {
      codigo: parseInt(codigoRecuperacao),
      uscodigo: user.uscodigo,
    }

    await this.codigosRecuperacaoSenhasServices.create(objRecuperarSenha);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: destinatario,
      subject: 'Recuperação de Senha - FiscalizaAI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF6B00;">Recuperação de Senha</h2>
          <p>Olá, ${user.usnome}</p>
          <p>Recebemos sua solicitação de recuperação de senha.</p>
          <p>Seu código de recuperação é: <strong style="font-size: 24px; color: #FF6B00;">${codigoRecuperacao}</strong></p>
          <p>Use este código para redefinir sua senha.</p>
          <p>Se você não solicitou a recuperação de senha, por favor ignore este email.</p>

          <a href="https://fiscalizaai-front-end.vercel.app/redefinirSenha">https://fiscalizaai-front-end.vercel.app/redefinirSenha</a>
          <br>
          <p>Atenciosamente,</p>
          <p>Equipe FiscalizaAI</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return false;
    }
  }

  async create(usuario: UsuarioType, endereco: EnderecosType) {
    try {
      await this.prisma.$transaction(async (prisma) => {
        const passwordCrypt = await bcrypt.hash(usuario.ussenha, saltOrRounds);

        const enderecoCreate = await this.enderecoService.create(endereco);

        await prisma.usuarios.create({
          data: {
            uscodigo: randomUUID(),
            usnome: usuario.usnome,
            usemail: usuario.usemail,
            ussenha: passwordCrypt,
            usendereco: enderecoCreate.edcodigo,
            usmaster: usuario.usmaster
          },
        });
      });

      return { status: true, message: 'Usuário cadastrado com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível criar o usuário, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async update(usuario: UsuarioType) {
    try {
      await this.prisma.$transaction(async (prisma) => {
        const passwordCrypt = await bcrypt.hash(usuario.ussenha, saltOrRounds);

        await prisma.usuarios.update({
          where: {
            uscodigo: usuario.uscodigo,
          },
          data: {
            usnome: usuario.usnome,
            usemail: usuario.usemail,
            ussenha: passwordCrypt,
            usmaster: usuario.usmaster
          },
        });
      });

      return { status: true, message: 'Usuário atualizado com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível atualizar o usuário, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async find(uscodigo: string) {
    try {
      const usuario = await this.prisma.usuarios.findFirst({
        where: {
          uscodigo
        },
        select: {
          uscodigo: true,
          usemail: true,
          usnome: true,
          usendereco: true,
          usmaster: true,
          endereco: true,
        },
      });

      return { status: true, message: 'Usuário consultado com sucesso!', usuario };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível consultar o usuário, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async solicitarRecuperacaoSenha(body: EsqueciSenhaType) {
    try {
      const usuario = await this.prisma.usuarios.findFirst({
        where: {
          usemail: body.email
        }
      });

      if (!usuario) {
        throw new HttpException(
          { status: false, error: 'Email não encontrado' },
          HttpStatus.NOT_FOUND
        );
      }

      const emailEnviado = await this.enviarEmail(body.email);

      if (!emailEnviado) {
        throw new HttpException(
          { status: false, error: 'Erro ao enviar email de recuperação' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return {
        status: true,
        message: 'Solicitação de recuperação de senha realizada com sucesso!'
      };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível solicitar a recuperação de senha, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async redefinirSenha(body: RedefinirSenhaType) {
    try {
      const codigoRecuperacao = await this.prisma.codigosRecuperacaoSenhas.findFirst({
        where: {
          crscodigorecuperacao: parseInt(body.codigo)
        }
      });

      if (!codigoRecuperacao) {
        throw new HttpException(
          { status: false, error: 'Código de recuperação não encontrado' },
          HttpStatus.NOT_FOUND
        );
      }

      const usuario = await this.prisma.usuarios.findFirst({
        where: {
          uscodigo: codigoRecuperacao.crsusuario
        }
      });

      if (!usuario) {
        throw new HttpException(
          { status: false, error: 'Usuário não encontrado' },
          HttpStatus.NOT_FOUND
        );
      }

      const passwordCrypt = await bcrypt.hash(body.novaSenha, saltOrRounds);

      await this.prisma.usuarios.update({
        where: {
          uscodigo: usuario.uscodigo
        },
        data: {
          ussenha: passwordCrypt
        }
      });
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível trocar a senha, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async trocaSenha(body: TrocaSenhaType) {
    try {
      const usuario = await this.prisma.usuarios.findFirst({
        where: {
          uscodigo: body.uscodigo
        }
      });

      if (!usuario) {
        throw new HttpException(
          { status: false, error: 'Usuário não encontrado' },
          HttpStatus.NOT_FOUND
        );
      }

      const senhaCorreta = await bcrypt.compare(body.senhaAntiga, usuario.ussenha);
      if (!senhaCorreta) {
        throw new HttpException(
          { status: false, error: 'Senha antiga divergente!' },
          HttpStatus.BAD_REQUEST
        );
      }

      const passwordCrypt = await bcrypt.hash(body.novaSenha, saltOrRounds);

      await this.prisma.usuarios.update({
        where: {
          uscodigo: usuario.uscodigo
        },
        data: {
          ussenha: passwordCrypt
        }
      });

      return { status: true, message: 'Senha alterada com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível trocar a senha, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }
}
