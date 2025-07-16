import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as cors from 'cors';

// Controllers
import { AuthController } from './controllers/app.auth.controller';
import { UsuariosController } from './controllers/app.usuarios.controller';
import { EnderecosController } from './controllers/app.enderecos.controller';
import { EstadosController } from './controllers/app.estados.controller';
import { MunicipiosController } from './controllers/app.municipios.controller';
import { ContatosMunicipiosController } from './controllers/app.contatosMunicipios.controller';
import { NotificacoesController } from './controllers/app.notificacoes.controller';
import { CategoriasProblemasController } from './controllers/app.categoriasProblemas.controller';
import { ProblemasController } from './controllers/app.problemas.controller';
import { FotosProblemasController } from './controllers/app.fotosProblemas.controller';
import { HistoricoCorrecoesProblemasController } from './controllers/app.historicoCorrecoesProblemas.controller';
import { HistoricoRelatosController } from './controllers/app.historicoRelatos.controller';
import { FiscalizaAIController } from './controllers/app.fiscalizaAI.controller';
import { FeedbacksUsuariosController } from './controllers/app.feedbacksUsuarios.controller';
import { FeaturesController } from './controllers/app.features.controller';

//Services
import { PrismaService } from './prisma.service';
import { AuthService } from './services/app.auth.service';
import { JwtStrategy } from './helpers/JWTStrategy';
import { UsuarioService } from './services/app.usuarios.service';
import { EnderecosService } from './services/app.enderecos.service';
import { EstadosService } from './services/app.estados.service';
import { MunicipiosService } from './services/app.municipios.service';
import { ContatosMunicipiosService } from './services/app.contatosMunicipios.service';
import { NotificacoesService } from './services/app.notificacoes.service';
import { CategoriasProblemasServices } from './services/app.categoriasProblemas.service';
import { ProblemasServices } from './services/app.problemas.service';
import { FotosProblemasService } from './services/app.fotosProblemas.service';
import { CodigosRecuperacaoSenhasServices } from './services/app.codigosRecuperacaoSenhas.service';
import { HistoricoCorrecoesProblemasService } from './services/app.historicoCorrecoesProblemas.service';
import { HistoricoRelatosService } from './services/app.historicoRelatos.service';
import { FiscalizaAIService } from './services/app.fiscalizaAI.service';
import { FeedbacksUsuariosService } from './services/app.feedbacksUsuarios.service';
import { FeaturesService } from './services/app.features.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
    }),
  ],
  controllers: [
    AuthController,
    UsuariosController,
    EnderecosController,
    EstadosController,
    MunicipiosController,
    CategoriasProblemasController,
    ProblemasController,
    ContatosMunicipiosController,
    FotosProblemasController,
    NotificacoesController,
    HistoricoCorrecoesProblemasController,
    HistoricoRelatosController,
    FiscalizaAIController,
    FeedbacksUsuariosController,
    FeaturesController,
  ],
  providers: [
    PrismaService,
    AuthService,
    JwtStrategy,
    UsuarioService,
    EnderecosService,
    EstadosService,
    MunicipiosService,
    CategoriasProblemasServices,
    ProblemasServices,
    ContatosMunicipiosService,
    FotosProblemasService,
    NotificacoesService,
    CodigosRecuperacaoSenhasServices,
    HistoricoCorrecoesProblemasService,
    HistoricoRelatosService,
    FiscalizaAIService,
    FeedbacksUsuariosService,
    FeaturesService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}
