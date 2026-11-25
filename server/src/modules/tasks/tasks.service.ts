import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GameService } from '../game/game.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private isRunning = false;

  constructor(private readonly gameService: GameService) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCompletedFishingActions(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn(
        'Пропуск тика: предыдущая проверка действий еще не завершена',
      );
      return;
    }

    this.isRunning = true;

    try {
      await this.gameService.closeCompletedActions();
    } catch (error) {
      this.logger.error(
        'Ошибка при закрытии завершенных действий рыбалки',
        error instanceof Error ? error.stack : String(error),
      );
    } finally {
      this.isRunning = false;
    }
  }
}
