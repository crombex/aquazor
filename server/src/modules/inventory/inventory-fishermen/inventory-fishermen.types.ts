import { FishermanEntity } from '../../bestiary/fishermen/fishermen.types';

export type InventoryFishermanEntity = TAddInventoryFisherman &
  Omit<FishermanEntity, 'id'>;

export type TAddInventoryFisherman = {
  id: string;
  fishermanId: string;
  userId: string;
  startedAt?: string;
  finishedAt?: string;
  status: 'busy' | 'free';
};

export type TInventoryFishermanRow = Omit<
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
  level_required: number;
  started_at: string;
  finished_at: string;
};
