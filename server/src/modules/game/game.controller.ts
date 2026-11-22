import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guard";
import { UseUser } from "../auth/auth.decorators";
import { StartFishingDTO } from "./dto/start-fishing.dto";
import { GameService } from "./game.service";

@UseGuards(AuthGuard)
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('fishing')
  async startFishing(@UseUser('sub') userId: string, @Body() body: StartFishingDTO) {
    return await this.gameService.startFishing({
      userId,
      ...body
    })
  }
}