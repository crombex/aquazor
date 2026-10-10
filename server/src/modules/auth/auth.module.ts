import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthRepository } from './auth.repository';
import { AuthGuard } from './auth.guard';
import { CookiesModule } from '../cookies/cookies.module';
import { AuthSessionService } from './auth-session.service';
import { AuthTokenService } from './auth-token.service';

@Module({
  imports: [UsersModule, CookiesModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, AuthGuard, AuthSessionService, AuthTokenService],
  exports: [AuthGuard]
})
export class AuthModule {}
