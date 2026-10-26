import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { FishModule } from '../fish/fish.module';
import { RodsModule } from '../rods/rods.module';
import { LocationsModule } from '../locations/locations.module';
import { FishermenModule } from '../fishermen/fishermen.module';
import { BaitsModule } from '../baits/baits.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    FishModule,
    RodsModule,
    LocationsModule,
    FishermenModule,
    BaitsModule
  ],
})
export class AppModule {}
