import { Injectable } from '@nestjs/common';
import {
  gameConstants,
  gameWeights,
  baseRarityWeights,
  baitLosingProbabilities,
  experiencePerFishRarity,
} from './constants';
import { IGameInputData, IGameSlot, TActualFish } from './game.types';
import {
  getRandomValue,
  randomPickInRange,
} from '../../../common/utils/random-pick';
import {
  getFishRarity,
  logisticalTransformation,
  logit,
  simulateProbability,
} from './helpers';
import { FishService } from '../../bestiary/fish/fish.service';

@Injectable()
export class GameCoreService {
  constructor(private readonly fishService: FishService) {}

  async simulate({ rods, baits, fisherman, player, location }: IGameInputData) {
    const rodsCopy = structuredClone(rods);
    const baitsCopy = structuredClone(baits);
    const fishermanSkillNormalized = (fisherman.skill + 1) / 2;

    const totalBaits = baitsCopy.reduce((acc, bait) => acc + bait.quantity, 0);
    const slotsNumber = totalBaits * gameConstants.slotsPerBait + Math.floor(player.level / 2);
    const fishingTime =
      slotsNumber * gameConstants.secondsPerSlot -
      (rods.length - 1) * gameConstants.secondsReductionPerExtraRod;

    const slots = Array.from<void, IGameSlot>({ length: slotsNumber }, () => ({
      bestiaryFish: null,
      actualFish: null,
      rod: null,
      bait: null,
    }));
    for (let index = 0; index < slots.length; index++) {
      const slot = slots[index];
      // artificial entropy for shuffling elements in an array
      const randomNumber = randomPickInRange(16, 256, true);
      slot.rod = structuredClone(
        rodsCopy[(index + randomNumber) % rodsCopy.length],
      );
      let baitIndex = -1;
      for (let i = 0; i < baitsCopy.length; i++) {
        if (baitsCopy[(i + randomNumber) % baitsCopy.length].quantity > 0) {
          baitIndex = (i + randomNumber) % baitsCopy.length;
          break;
        }
      }
      if (baitIndex >= 0) {
        const { quantity, ...bait } = structuredClone(baitsCopy[baitIndex]);
        slot.bait = bait;
        baitsCopy[baitIndex].quantity--;
      }

      const fertilityNormalized = (location.fertility - 1) / 2;
      const baitRarityNormalized = slot.bait
        ? (baseRarityWeights[slot.bait.rarity].index -
            baseRarityWeights.common.index) /
          4
        : 0;
      const attractiveness =
        gameWeights.fertilityRarity * fertilityNormalized +
        gameWeights.baitRarity * baitRarityNormalized;
      const randomRarity = getFishRarity(attractiveness);
      if (randomRarity !== 'nothing') {
        const randomBestiaryFish =
          await this.fishService.getOneInCategory(randomRarity);
        slot.bestiaryFish = randomBestiaryFish;
      } else {
        if (slot.bait) {
          baitsCopy[baitIndex].quantity++;
        }
      }
    }
    slots.forEach((slot) => {
      if (slot.bestiaryFish) {
        const newFreeBaitIndexIfPossible = baitsCopy.findIndex(
          (bait) => bait.quantity > 0,
        );
        const rodEfficiencyNormalized = (slot.rod!.efficiency + 1) / 2;
        if (!slot.bait && newFreeBaitIndexIfPossible !== -1) {
          const { quantity, ...bait } = structuredClone(
            baitsCopy[newFreeBaitIndexIfPossible],
          );
          slot.bait = bait;
          baitsCopy[newFreeBaitIndexIfPossible].quantity--;
        }
        const catchScore =
          fishermanSkillNormalized * gameWeights.fishermanSkill +
          rodEfficiencyNormalized * gameWeights.rodEfficiency +
          (slot.bait ? slot.bait.efficiency : 0) * gameWeights.baitEfficiency;

        const fishCatchProbability =
          slot.bestiaryFish.minProbability +
          (slot.bestiaryFish.maxProbability -
            slot.bestiaryFish.minProbability) *
            catchScore *
            (slot.bait ? 1 : gameWeights.bareHookFactor);
        const fishingResult = simulateProbability(fishCatchProbability);
        if (fishingResult) {
          const sizeScore =
            gameWeights.rodPower * slot.rod!.power +
            gameWeights.fishermanLuck * fisherman.luck +
            gameWeights.fertilitySize * location.fertility;
          const sizeOffset = logisticalTransformation(
            logit(getRandomValue()) * gameWeights.sizeLogitCoefficient +
              gameWeights.sizeDistributionCoefficient * sizeScore,
          );
          const fishWeight =
            slot.bestiaryFish.minWeight +
            (slot.bestiaryFish.maxWeight - slot.bestiaryFish.minWeight) *
              sizeOffset;
          const fishLength =
            slot.bestiaryFish.minLength +
            (slot.bestiaryFish.maxLength - slot.bestiaryFish.minLength) *
              sizeOffset;
          const fishPrice =
            slot.bestiaryFish.minSellPrice *
            Math.sqrt(fishWeight / slot.bestiaryFish.minWeight);
          const caughtFish: TActualFish = {
            fishId: slot.bestiaryFish.id,
            weight: fishWeight,
            length: fishLength,
            sellPrice: fishPrice,
          };
          slot.actualFish = caughtFish;
          if (slot.bait) {
            const isBaitLost = simulateProbability(
              baitLosingProbabilities[slot.bait.rarity],
            );
            if (!isBaitLost) {
              const baitsArrayIndex = baitsCopy.findIndex(
                (elem) => elem.id === slot.bait!.id,
              );
              baitsCopy[baitsArrayIndex].quantity++;
            }
          }
        }
      }
    });
    let experienceEarned = 0;
    slots.forEach((slot) => {
      if (slot.bestiaryFish && slot.actualFish) {
        experienceEarned += experiencePerFishRarity[slot.bestiaryFish.rarity];
      }
    });
    return {
      fishingTime,
      attempts: slots,
      experienceEarned,
      baitsRemained: baitsCopy,
    };
  }
}
