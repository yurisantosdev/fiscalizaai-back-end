/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { CategoriasProblemasType } from 'src/types/CategoriasProblemasType';
import { SelectValuesType } from 'src/types/GeneralTypes';

@Injectable()
export class CategoriasProblemasServices {
  // eslint-disable-next-line prettier/prettier
  constructor(readonly prisma: PrismaService) { }

  async create(categoria: CategoriasProblemasType) {
    try {
      await this.prisma.$transaction(async (prisma) => {

        await prisma.categoriasProblemas.create({
          data: {
            cacodigo: randomUUID(),
            cacategoria: categoria.cacategoria,
            cadescricao: categoria.cadescricao,
          },
        });
      });

      return { status: true, message: 'Categoria de problema cadastrado com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível criar a categoria de problema, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async update(categoria: CategoriasProblemasType) {
    try {
      await this.prisma.$transaction(async (prisma) => {

        await prisma.categoriasProblemas.update({
          where: {
            cacodigo: categoria.cacodigo,
          },
          data: {
            cacategoria: categoria.cacategoria,
            cadescricao: categoria.cadescricao,
          },
        });
      });

      return { status: true, message: 'Categoria de problema atualizada com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível atualizar a categoria de problema, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async desativarAtivar(categoria: CategoriasProblemasType) {
    try {
      await this.prisma.$transaction(async (prisma) => {

        await prisma.categoriasProblemas.update({
          where: {
            cacodigo: categoria.cacodigo,
          },
          data: {
            caativa: !categoria.caativa,
          },
        });
      });

      return { status: true, message: 'Categoria de problema desativada com sucesso!' };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível desativar a categoria de problema, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async findAllAtivas() {
    try {
      let categorias: Array<SelectValuesType>;

      await this.prisma.$transaction(async (prisma) => {
        const categoriasConsulta = await prisma.categoriasProblemas.findMany({
          where: {
            caativa: true,
          },
          select: {
            cacodigo: true,
            cacategoria: true,
            cadescricao: true,
            caativa: true,
          }
        });

        categorias = categoriasConsulta.map((categoria) => {
          return {
            value: categoria.cacodigo,
            label: categoria.cacategoria,
            description: categoria.cadescricao,
            caativa: categoria.caativa,
          }
        })
      });

      return { status: true, message: 'Categorias consultadas com sucesso!', categorias };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível consultar as categorias, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }

  async findAll() {
    try {
      let categorias: Array<SelectValuesType>;

      await this.prisma.$transaction(async (prisma) => {
        const categoriasConsulta = await prisma.categoriasProblemas.findMany({
          select: {
            cacodigo: true,
            cacategoria: true,
            cadescricao: true,
            caativa: true,
          },
          orderBy: {
            caativa: 'desc'
          }
        });

        categorias = categoriasConsulta.map((categoria) => {
          return {
            value: categoria.cacodigo,
            label: categoria.cacategoria,
            description: categoria.cadescricao,
            caativa: categoria.caativa,
          }
        })
      });

      return { status: true, message: 'Categorias consultadas com sucesso!', categorias };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.getResponse()
          : 'Não foi possível consultar as categorias, por favor tente novamente!';

      throw new HttpException({ status: false, error: errorMessage }, HttpStatus.FORBIDDEN);
    }
  }
}
