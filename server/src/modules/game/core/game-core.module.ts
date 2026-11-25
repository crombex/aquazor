import { Module } from '@nestjs/common';
import { GameCoreService } from './game-core.service';

@Module({
  imports: [],
  providers: [GameCoreService],
  exports: [GameCoreService],
})
export class GameCoreModule {}
