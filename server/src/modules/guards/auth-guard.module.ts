import { forwardRef, Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { SessionsModule } from '../sessions/sessions.module';
import { TokensModule } from '../tokens/tokens.module';
import { UsersModule } from '../users/users.module';

console.log('Проверка экспортов:', {
  AuthGuard,
  TokensModule,
  SessionsModule,
  UsersModule,
});

@Module({
  imports: [SessionsModule, TokensModule, forwardRef(() => UsersModule)],
  providers: [AuthGuard],
  exports: [
    AuthGuard,
    SessionsModule,
    TokensModule,
    forwardRef(() => UsersModule),
  ],
})
export class AuthGuardModule {}
