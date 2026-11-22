import { StartFishingDTO } from "./dto/start-fishing.dto";

export type TGameRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface IStartFishingBody {
  userId: string;
  rods: StartFishingDTO['rods'];
  baits: StartFishingDTO['baits'],
  fisherman: StartFishingDTO['fisherman'];
  location: StartFishingDTO['location']
}