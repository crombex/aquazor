import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { UsersModule } from '../users/users.module';
import { InventoryRodsModule } from '../inventory/inventory-rods/inventory-rods.module';
import { InventoryBaitsModule } from '../inventory/inventory-baits/inventory-baits.module';
import { InventoryFishermenModule } from '../inventory/inventory-fishermen/inventory-fishermen.module';
import { InventoryFishModule } from '../inventory/inventory-fish/inventory-fish.module';
import { LocationsModule } from '../bestiary/locations/locations.module';
import { GameCoreModule } from './core/game-core.module';
import { AuthGuardModule } from '../guards/auth-guard.module';
import { RodsModule } from '../bestiary/rods/rods.module';
import { BaitsModule } from '../bestiary/baits/baits.module';
import { FishermenModule } from '../bestiary/fishermen/fishermen.module';
import { TransactionManagerModule } from '../transaction-manager/transaction-manager.module';
import { GameRepository } from './game.repository';

@Module({
  imports: [
    UsersModule,
    InventoryRodsModule,
    InventoryBaitsModule,
    InventoryFishermenModule,
    InventoryFishModule,
    LocationsModule,
    GameCoreModule,
    AuthGuardModule,
    RodsModule,
    BaitsModule,
    FishermenModule,
    TransactionManagerModule,
  ],
  controllers: [GameController],
  providers: [GameService, GameRepository],
  exports: [GameService],
})
export class GameModule {}
