import { RodEntity } from '../../bestiary/rods/rods.types';

export type InventoryRodEntity = TAddInventoryRod & Omit<RodEntity, 'id'>;

export type TAddInventoryRod = {
  id: string;
  rodId: string;
  userId: string;
  startedAt: string;
  finishedAt: string;
};

export type TInventoryRodFromDatabase = Omit<
  InventoryRodEntity,
  | 'sellPrice'
  | 'rodId'
  | 'userId'
  | 'imageUrl'
  | 'buyPrice'
  | 'levelRequired'
  | 'startedAt'
  | 'finishedAt'
> & {
  sell_price: number;
  rod_id: string;
  user_id: string;
  image_url: string;
  buyPrice: number;
  levelRequired: number;
  started_at: string;
  finished_at: string;
};
