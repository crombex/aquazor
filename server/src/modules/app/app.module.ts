import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { FishModule } from '../bestiary/fish/fish.module';
import { RodsModule } from '../bestiary/rods/rods.module';
import { LocationsModule } from '../bestiary/locations/locations.module';
import { FishermenModule } from '../bestiary/fishermen/fishermen.module';
import { BaitsModule } from '../bestiary/baits/baits.module';

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
    BaitsModule,
  ],
})
export class AppModule {}
