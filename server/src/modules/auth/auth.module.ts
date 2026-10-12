import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { CookiesModule } from '../cookies/cookies.module';
import { SessionsModule } from '../sessions/sessions.module';
import { TokensModule } from '../tokens/tokens.module';
import { AuthGuardModule } from '../guards/auth-guard.module';

@Module({
  imports: [
    AuthGuardModule,
    UsersModule,
    CookiesModule,
    SessionsModule,
    TokensModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
