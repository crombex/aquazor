import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthGuardModule } from '../guards/auth-guard.module';
import { TokensModule } from '../tokens/tokens.module';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [AuthGuardModule, TokensModule, SessionsModule],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [UsersService]
})
export class UsersModule {}
