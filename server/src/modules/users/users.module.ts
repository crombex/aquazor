import { forwardRef, Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthGuardModule } from '../guards/auth-guard.module';

@Module({
  imports: [forwardRef(() => AuthGuardModule)],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
