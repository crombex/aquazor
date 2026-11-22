import { BaitEntity } from '../../bestiary/baits/baits.types';
import { FishEntity } from '../../bestiary/fish/fish.types';
import { FishermanEntity } from '../../bestiary/fishermen/fishermen.types';
import { LocationEntity } from '../../bestiary/locations/locations.types';
import { RodEntity } from '../../bestiary/rods/rods.types';
import { InventoryFishEntity } from '../../inventory/inventory-fish/inventory-fish.types';

type TBait = BaitEntity & { quantity: number };
export type TActualFish = Pick<
  InventoryFishEntity,
  'fishId' | 'length' | 'sellPrice' | 'weight'
>;

export interface IGameInputData {
  rods: RodEntity[];
  fisherman: FishermanEntity;
  location: LocationEntity;
  player: { level: number };
  baits: TBait[];
}

export interface IGameSlot {
  bestiaryFish: FishEntity | null;
  actualFish: TActualFish | null;
  rod: RodEntity | null;
  bait: BaitEntity | null;
  experienceEarned: number;
}

interface IRaritySlot {
  index: number;
  weight: number;
}

export interface IRarity {
  common: IRaritySlot;
  uncommon: IRaritySlot;
  rare: IRaritySlot;
  epic: IRaritySlot;
  legendary: IRaritySlot;
}
