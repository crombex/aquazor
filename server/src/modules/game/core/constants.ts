import { IRarity } from './game.types';

export const gameConstants = {
  slotsPerBait: 4,
  minBaitQuantity: 5,
  maxBaitQuantity: 20,
  maxSlots: 80,
  maxRods: 3,
  maxBaitTypes: 3,
  secondsPerSlot: 15,
  secondsReductionPerExtraRod: 40,
} as const;

export const gameWeights = {
  fishermanSkill: 0.45,
  rodEfficiency: 0.3,
  baitEfficiency: 0.25,
  fertilityRarity: 0.65,
  baitRarity: 0.35,
  rodPower: 0.45,
  fishermanLuck: 0.35,
  fertilitySize: 0.2,
  sizeDistributionCoefficient: 0.8,
  rarityTiltCoefficient: 0.5,
  bareHookFactor: 0.05,
  sizeLogitCoefficient: 0.2,
} as const;

export const baseRarityWeights = {
  common: {
    weight: 40,
    index: 1,
  },
  uncommon: {
    weight: 30,
    index: 2,
  },
  rare: {
    weight: 14,
    index: 3,
  },
  epic: {
    weight: 5,
    index: 4,
  },
  legendary: {
    weight: 1,
    index: 5,
  },
} as const satisfies IRarity;

export const baitLosingProbabilities = {
  common: 0.15,
  uncommon: 0.35,
  rare: 0.5,
  epic: 0.8,
  legendary: 0.9,
} as const;

export const experiencePerFishRarity = {
  common: 2,
  uncommon: 5,
  rare: 12,
  epic: 30,
  legendary: 100,
} as const;
