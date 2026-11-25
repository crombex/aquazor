import { TGameRarity } from '../game.types';
import { gameWeights, baseRarityWeights } from './constants';
import { IRarity } from './game.types';
import { getRandomValue } from '../../../common/utils/random-pick';

export function simulateProbability(targetProbability: number) {
  const p = getRandomValue();
  return p < targetProbability ? true : false;
}

export function logit(u: number) {
  return Math.log(u / (1 - u));
}

export function logisticalTransformation(x: number) {
  return 1 / (1 + Math.pow(Math.E, -x));
}

export function getFishRarity(attractiveness: number): TGameRarity | 'nothing' {
  let totalWeight = 0;
  const nothingProbability = 0.1;
  const baseRarityWeightsCopy: IRarity = structuredClone(baseRarityWeights);
  for (const key of Object.keys(baseRarityWeights) as (keyof IRarity)[]) {
    baseRarityWeightsCopy[key].weight *= Math.pow(
      Math.E,
      gameWeights.rarityTiltCoefficient *
        (attractiveness - 0.5) *
        (baseRarityWeightsCopy[key].index - 3),
    );
    totalWeight += baseRarityWeightsCopy[key].weight;
  }
  const commonProbability =
    (baseRarityWeightsCopy.common.weight / totalWeight) *
    (1 - nothingProbability);
  const uncommonProbability =
    (baseRarityWeightsCopy.uncommon.weight / totalWeight) *
    (1 - nothingProbability);
  const rareProbability =
    (baseRarityWeightsCopy.rare.weight / totalWeight) *
    (1 - nothingProbability);
  const epicProbability =
    (baseRarityWeightsCopy.epic.weight / totalWeight) *
    (1 - nothingProbability);
  const legendaryProbability =
    (baseRarityWeightsCopy.legendary.weight / totalWeight) *
    (1 - nothingProbability);

  const probabilities = [
    [0, nothingProbability],
    [0, commonProbability],
    [0, uncommonProbability],
    [0, rareProbability],
    [0, epicProbability],
    [0, legendaryProbability],
  ];
  let lastValue = 0;
  for (let i = 0; i < probabilities.length; i++) {
    probabilities[i][0] = lastValue;
    probabilities[i][1] = lastValue + probabilities[i][1];
    lastValue = probabilities[i][1];
  }

  const randomValue = getRandomValue();
  for (let i = 0; i < probabilities.length; i++) {
    if (
      randomValue >= probabilities[i][0] &&
      randomValue < probabilities[i][1]
    ) {
      switch (i) {
        case 0:
          return 'nothing' as const;
        case 1:
          return 'common';
        case 2:
          return 'uncommon';
        case 3:
          return 'rare';
        case 4:
          return 'epic';
        case 5:
          return 'legendary';
      }
    }
  }
  return 'nothing' as const;
}
