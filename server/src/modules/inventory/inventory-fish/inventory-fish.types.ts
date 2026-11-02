import { PoolClient } from "pg";

export interface InventoryFishEntity {
  id: string;
  userId: string;
  fishId: string;
  weight: number;
  length: number;
  description: string;
  sellPrice: number;
}

export type TInventoryFishInDatabase = Omit<
  InventoryFishEntity,
  'userId' | 'fishId' | 'sellPrice'
> & { user_id: string; fish_id: string; sell_price: number };

export type TAddInventoryFish = {
  fish: InventoryFishEntity;
  userId: string;
  connection?: PoolClient
};
