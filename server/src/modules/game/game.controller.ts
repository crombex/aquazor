import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { UseUser } from '../auth/auth.decorators';
import { StartFishingDTO } from './dto/start-fishing.dto';
import { GameService } from './game.service';
import { GetHistoryDTO } from './dto/get-history.dto';

@UseGuards(AuthGuard)
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('fishing')
  async startFishing(
    @UseUser('sub') userId: string,
    @Body() body: StartFishingDTO,
  ) {
    return await this.gameService.startFishing({
      userId,
      ...body,
    });
  }

  @Get('history')
  async getUserHistory(
    @UseUser('sub') userId: string,
    @Query() { limit, offset }: GetHistoryDTO,
  ) {
    return await this.gameService.getUserFullFishingActions({
      userId,
      limit,
      offset,
    });
  }
}
