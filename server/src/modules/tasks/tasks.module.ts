import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { GameModule } from '../game/game.module';

@Module({
  imports: [GameModule],
  providers: [TasksService],
})
export class TasksModule {}
