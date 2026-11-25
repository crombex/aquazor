import { PoolClient } from 'pg';
import { BaitEntity } from '../../bestiary/baits/baits.types';

export type InventoryBaitEntity = TAddInventoryBait & Omit<BaitEntity, 'id'>;

export type TAddInventoryBait = {
  id: string;
  baitId: string;
  quantity: number;
  userId: string;
};

export type TInventoryBaitRow = Omit<
  InventoryBaitEntity,
  'sellPrice' | 'baitId' | 'userId' | 'imageUrl' | 'buyPrice' | 'levelRequired'
> & {
  sell_price: number;
  bait_id: string;
  user_id: string;
  image_url: string;
  buy_price: number;
  level_required: number;
};

export type TChangeInvenoryBaitsAmount = {
  id: string;
  amount: number;
  connection?: PoolClient;
};
