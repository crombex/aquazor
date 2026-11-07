import { FishermanEntity } from '../../bestiary/fishermen/fishermen.types';

export type InventoryFishermanEntity = TAddInventoryFisherman &
  Omit<FishermanEntity, 'id'>;

export type TAddInventoryFisherman = {
  id: string;
  fishermanId: string;
  userId: string;
  startedAt: string;
  finishedAt: string;
  energy: number;
};

export type TInventoryFishermanFromDatabase = Omit<
  InventoryFishermanEntity,
  | 'fishermanId'
  | 'userId'
  | 'avatarUrl'
  | 'levelRequired'
  | 'startedAt'
  | 'finishedAt'
> & {
  fisherman_id: string;
  user_id: string;
  avatar_url: string;
  levelRequired: number;
  started_at: string;
  finished_at: string;
};
