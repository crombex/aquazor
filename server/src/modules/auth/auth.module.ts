import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { CookiesModule } from '../cookies/cookies.module';
import { SessionsModule } from '../sessions/sessions.module';
import { TokensModule } from '../tokens/tokens.module';
import { AuthGuardModule } from '../guards/auth-guard.module';
import { FilesModule } from '../files/files.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    AuthGuardModule,
    UsersModule,
    CookiesModule,
    SessionsModule,
    TokensModule,
    FilesModule,
    MulterModule.register({
      limits: {
        fileSize: 20 * 1024 * 1024,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
