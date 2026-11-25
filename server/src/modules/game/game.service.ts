import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InventoryRodsService } from '../inventory/inventory-rods/inventory-rods.service';
import { InventoryBaitsService } from '../inventory/inventory-baits/inventory-baits.service';
import { LocationsService } from '../bestiary/locations/locations.service';
import {
  IFishingAction,
  IFishingActionSlot,
  IStartFishingBody,
  TFishingActionsUser,
} from './game.types';
import { InventoryFishermenService } from '../inventory/inventory-fishermen/inventory-fishermen.service';
import { GameCoreService } from './core/game-core.service';
import { RodsService } from '../bestiary/rods/rods.service';
import { BaitsService } from '../bestiary/baits/baits.service';
import { FishermenService } from '../bestiary/fishermen/fishermen.service';
import { RodEntity } from '../bestiary/rods/rods.types';
import { BaitEntity } from '../bestiary/baits/baits.types';
import { TransactionManagerService } from '../transaction-manager/transaction-manager.service';
import { PoolClient } from 'pg';
import { GameRepository } from './game.repository';
import { mapKeysToCamelCase } from '../../common/utils/change-case';
import { InventoryFishService } from '../inventory/inventory-fish/inventory-fish.service';
import { BaitDTO } from './dto/start-fishing.dto';
import { FishService } from '../bestiary/fish/fish.service';

@Injectable()
export class GameService {
  constructor(
    private readonly usersService: UsersService,
    private readonly inventoryRodsService: InventoryRodsService,
    private readonly inventoryBaitsService: InventoryBaitsService,
    private readonly locationsService: LocationsService,
    private readonly inventoryFishermenService: InventoryFishermenService,
    private readonly gameCoreService: GameCoreService,
    private readonly rodsService: RodsService,
    private readonly baitsService: BaitsService,
    private readonly fishermenService: FishermenService,
    private readonly transactionManager: TransactionManagerService,
    private readonly gameRepository: GameRepository,
    private readonly inventoryFishService: InventoryFishService,
    private readonly fishService: FishService,
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
    const startedAt = new Date();
    const fishBestiary = await this.fishService.getAll();
    const totalBaits = baits.reduce(
      (acc, current) => acc + current.quantity,
      0,
    );

    const userRods = await this.inventoryRodsService.getAllUserRods(userId);
    rods.forEach((rodId) => {
      const sameRod = userRods.find((rod) => rod.id === rodId);
      if (!sameRod) {
        checkErrors.push(`User does not have rod with this id - ${rodId}`);
      } else if (
        (sameRod.finishedAt && new Date(sameRod.finishedAt) >= startedAt) ||
        sameRod.status === 'busy'
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
    if (totalBaits < 5 || totalBaits > 20) {
      checkErrors.push(`Amount of baits must be between 5 and 20`);
    }

    const userFishermen =
      await this.inventoryFishermenService.getAllUserFishermen(userId);
    const sameFisherman = userFishermen.find(
      (fisher) => fisher.id === fisherman,
    );
    if (!sameFisherman) {
      checkErrors.push(
        `User does not have fisherman with this id - ${fisherman}`,
      );
    } else if (
      (sameFisherman.finishedAt &&
        new Date(sameFisherman.finishedAt) >= startedAt) ||
      sameFisherman.status === 'busy'
    ) {
      checkErrors.push(
        `Fisherman with this id - ${fisherman} is on fishing now`,
      );
    } else if (sameFisherman.unavailable) {
      checkErrors.push(
        `Fisherman with this id - ${fisherman} is unavailable now`,
      );
    }

    const hasUserLocation = await this.locationsService.hasUserLocation(
      userId,
      location,
    );
    if (!hasUserLocation) {
      checkErrors.push(`User did not unlock this location - ${location}`);
    }

    if (checkErrors.length > 0) {
      throw new BadRequestException(checkErrors.join('\n'));
    }
    const rodsIdForFishing = rods.map(
      (rod) => userRods.find((item) => item.id === rod)!.rodId,
    );

    const fishermanForFishing = userFishermen.find(
      (fisher) => fisher.id === fisherman,
    )!;
    const inventoryFishermanId = fishermanForFishing.id;
    const fishermanIdForFishing = fishermanForFishing.fishermanId;

    const locationForFishing =
      await this.locationsService.findOneById(location);

    const playerStatsForFishing = { level: userLevel };

    const rodsForSimulation: RodEntity[] = [];
    const baitsForSimulation: (BaitEntity & { quantity: number })[] = [];
    const fishermanForSimulation = await this.fishermenService.findOneById(
      fishermanIdForFishing,
    );

    for (const rodId of rodsIdForFishing) {
      const bestiaryRod = await this.rodsService.findOneById(rodId);
      rodsForSimulation.push(bestiaryRod);
    }

    for (const bait of baits) {
      const inventoryBait = userBaits.find((item) => item.id === bait.id)!;
      const bestiaryBait = await this.baitsService.findOneById(
        inventoryBait.baitId,
      );
      baitsForSimulation.push({
        quantity: bait.quantity,
        ...bestiaryBait,
      });
    }

    const fishingResult = this.gameCoreService.simulate(
      {
        rods: rodsForSimulation,
        baits: baitsForSimulation,
        fisherman: fishermanForSimulation,
        location: locationForFishing,
        player: playerStatsForFishing,
      },
      fishBestiary,
    );

    const finishedAt = new Date(
      startedAt.getTime() + fishingResult.fishingTime * 1000,
    ).toISOString();

    const baitsToWriteOff = structuredClone(baits).map((bait) => ({
      ...bait,
      quantity: 0,
    }));
    fishingResult.attempts.forEach((slot) => {
      if (slot.baitConsumed) {
        baitsToWriteOff.find((elem) => elem.id === slot.bait!.id)!.quantity++;
      }
    });

    await this.transactionManager.run(async (client: PoolClient) => {
      for (const rodId of rods) {
        await this.inventoryRodsService.markBusy(
          { rodId, startedAt: startedAt.toISOString(), finishedAt },
          client,
        );
      }

      for (const bait of baitsToWriteOff) {
        await this.inventoryBaitsService.changeBaitsAmount({
          id: bait.id,
          amount: bait.quantity,
          connection: client,
        });
      }
      await this.inventoryFishermenService.markBusy(
        {
          fishermanId: inventoryFishermanId,
          startedAt: startedAt.toISOString(),
          finishedAt,
        },
        client,
      );
      const fishingActionUuid = crypto.randomUUID();
      await this.gameRepository.createFishingAction({
        payload: {
          id: fishingActionUuid,
          inventoryFishermanId,
          startedAt: startedAt.toISOString(),
          finishedAt: finishedAt,
          locationId: location,
          userId: userData.id,
          status: 'pending',
        },
        connection: client,
      });

      const mappedFishingSlots: IFishingActionSlot[] =
        fishingResult.attempts.map((attempt, index) => {
          return {
            id: crypto.randomUUID(),
            fishingActionId: fishingActionUuid,
            slotNumber: index + 1,
            inventoryRodId: attempt.rod!.id,
            inventoryBaitId: attempt.bait ? attempt.bait.id : null,
            fishId: attempt.bestiaryFish ? attempt.bestiaryFish.id : null,
            wasCaught: attempt.actualFish ? true : false,
            fishWeight: attempt.actualFish ? attempt.actualFish.weight : null,
            fishLength: attempt.actualFish ? attempt.actualFish.length : null,
            fishSellPrice: attempt.actualFish
              ? attempt.actualFish.sellPrice
              : null,
            experienceEarned: attempt.experienceEarned,
            baitConsumed: attempt.baitConsumed,
          };
        });
      await this.gameRepository.createFishingActionSlots({
        payload: mappedFishingSlots,
        connection: client,
      });
    });
    return finishedAt;
  }

  async closeCompletedActions() {
    await this.transactionManager.run(async (client: PoolClient) => {
      const finishedActionRows =
        await this.gameRepository.getPendingActions(client);
      const finishedActions = finishedActionRows.map((elem) =>
        mapKeysToCamelCase<IFishingAction>(elem),
      );

      for (let i = 0; i < finishedActions.length; i++) {
        const actionSlots = await this.gameRepository.getActionSlots(
          finishedActions[i].id,
          client,
        );
        const totalExperienceEarned = actionSlots.reduce(
          (acc, current) => acc + current.experience_earned,
          0,
        );
        const remainingBaits: BaitDTO[] = [];
        const rodsForRelease = new Set<string>();

        for (const slot of actionSlots) {
          const normalizedSlot = mapKeysToCamelCase<IFishingActionSlot>(slot);
          if (normalizedSlot.wasCaught && normalizedSlot.fishId) {
            const inventoryFishUuid = crypto.randomUUID();
            await this.inventoryFishService.addFish({
              item: {
                id: inventoryFishUuid,
                userId: finishedActions[i].userId,
                isSold: false,
                fishId: normalizedSlot.fishId,
                caughtTime: finishedActions[i].finishedAt,
                length: normalizedSlot.fishLength!,
                weight: normalizedSlot.fishWeight!,
                sellPrice: normalizedSlot.fishSellPrice!,
              },
              connection: client,
              userId: finishedActions[i].userId,
            });
            await this.gameRepository.updateActionSlot(
              normalizedSlot.id,
              inventoryFishUuid,
              client,
            );
          }
          if (!normalizedSlot.baitConsumed) {
            const baitIndex = remainingBaits.findIndex(
              (bait) => bait.id === normalizedSlot.inventoryBaitId,
            );
            if (baitIndex === -1) {
              remainingBaits.push({
                id: normalizedSlot.inventoryBaitId!,
                quantity: 1,
              });
            } else {
              remainingBaits[baitIndex].quantity++;
            }
          }
          rodsForRelease.add(normalizedSlot.inventoryRodId);
        }
        await this.gameRepository.updateAction(finishedActions[i].id, client);
        await this.usersService.changeExperienceAmount({
          userId: finishedActions[i].userId,
          amount: totalExperienceEarned,
          connection: client,
        });
        for (const bait of remainingBaits) {
          await this.inventoryBaitsService.changeBaitsAmount({
            id: bait.id,
            amount: bait.quantity,
            connection: client,
          });
        }
        for (const rodId of rodsForRelease) {
          await this.inventoryRodsService.markFree(rodId, client);
        }

        await this.inventoryFishermenService.markFree(
          finishedActions[i].inventoryFishermanId,
          client,
        );
      }
    });
  }

  async getUserFullFishingActions({
    userId,
    limit,
    offset,
  }: {
    userId: string;
    limit?: number;
    offset?: number;
  }) {
    if (!limit) {
      limit = 20;
    }
    if (!offset) {
      offset = 0;
    }

    const result = await this.gameRepository.getUserFullFishingActions({
      userId,
      offset,
      limit,
    });
    const normalizedResult: TFishingActionsUser[] = [];
    for (let i = 0; i < result.length; i++) {
      const normalizedHead = mapKeysToCamelCase<IFishingAction>(result[i].head);
      normalizedResult.push({ head: normalizedHead, slots: [] });
      for (const slot of result[i].slots) {
        const normalizedSlot = mapKeysToCamelCase<IFishingActionSlot>(slot);
        normalizedResult[i].slots.push(normalizedSlot);
      }
    }
    return normalizedResult;
  }
}
