import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InventoryRodsService } from '../inventory/inventory-rods/inventory-rods.service';
import { InventoryBaitsService } from '../inventory/inventory-baits/inventory-baits.service';
import { LocationsService } from '../bestiary/locations/locations.service';
import { InventoryFishService } from '../inventory/inventory-fish/inventory-fish.service';
import { IStartFishingBody } from './game.types';
import { InventoryFishermenService } from '../inventory/inventory-fishermen/inventory-fishermen.service';
import { GameCoreService } from './core/game-core.service';

@Injectable()
export class GameService {
  constructor(
    private readonly usersService: UsersService,
    private readonly inventoryRodsService: InventoryRodsService,
    private readonly inventoryBaitsService: InventoryBaitsService,
    private readonly locationsService: LocationsService,
    private readonly inventoryFishService: InventoryFishService,
    private readonly inventoryFishermenService: InventoryFishermenService,
    private readonly gameCoreService: GameCoreService
  ) {}

  async startFishing({
    userId,
    rods,
    location,
    baits,
    fisherman,
  }: IStartFishingBody) {
    const checkErrors: string[] = [];
    const userData = await this.usersService.findOneById(userId, {
      includeSensitiveData: false,
    });
    const userLevel = this.usersService.convertExperienceToLevel(
      userData.experience,
    );
    const startedTime = new Date().toLocaleString()

    const userRods = await this.inventoryRodsService.getAllUserRods(userId);
    rods.forEach((rodId) => {
      const sameRod = userRods.find((rod) => rod.id === rodId);
      if (!sameRod) {
        checkErrors.push(`User does not have rod with this id - ${rodId}`);
      } else if (
        sameRod.finishedAt &&
        sameRod.finishedAt >= startedTime
      ) {
        checkErrors.push(`Rod with this id - ${rodId} is on fishing now`);
      } else if (sameRod.unavailable) {
        checkErrors.push(`Rod with this id - ${rodId} is unavailable now`);
      }
    });

    const userBaits = await this.inventoryBaitsService.getAllUserBaits(userId);
    baits.forEach((bait) => {
      const sameBait = userBaits.find((userBait) => userBait.id === bait.id);
      if (!sameBait || sameBait.quantity < bait.quantity) {
        checkErrors.push(
          `User does not have bait with this id - ${bait.id} or it amount not enough`,
        );
      } else if (sameBait.unavailable) {
        checkErrors.push(`Bait with this id - ${bait.id} is unavailable now`);
      }
    });

    const userFishermen =
      await this.inventoryFishermenService.getAllUserFishermen(userId);
    const sameFisherman = userFishermen.find(fisher => fisher.id === fisherman)
    if (!sameFisherman) {
      checkErrors.push(`User does not have fisherman with this id - ${fisherman}`);
    } else if (sameFisherman.finishedAt >= startedTime) {
      checkErrors.push(`Fisherman with this id - ${fisherman} is on fishing now`);
    } else if (sameFisherman.unavailable) {
      checkErrors.push(`Fisherman with this id - ${fisherman} is unavailable now`);
    }

    const hasUserLocation = await this.locationsService.hasUserLocation(userId, location)
    if (!hasUserLocation) {
      checkErrors.push(`User did not unlock this location - ${location}`);
    }
    
    if (checkErrors.length > 0) {
      throw new BadRequestException(checkErrors.join('\n'))
    }
    const rodsForFishing = userRods.filter(rod => rods.includes(rod.id))
    const baitsForFishing = userBaits.filter(bait => baits.map(item => item.id).includes(bait.id))
    const fishermanForFishing = userFishermen.find(fisher => fisher.id === fisherman)
    const locationForFishing = await this.locationsService.findOneById(location)
    const playerStatsForFishing = {level: userLevel}
    const fishingResult = this.gameCoreService.simulate({
      rods: rodsForFishing,
      baits: baitsForFishing,
      fisherman: fishermanForFishing!,
      location: locationForFishing,
      player: playerStatsForFishing
    })

    
  }
}
