import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CookiesModule } from '../cookies/cookies.module';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot({
    isGlobal: true,
  }), AuthModule, UsersModule, CookiesModule]
})
export class AppModule {}
