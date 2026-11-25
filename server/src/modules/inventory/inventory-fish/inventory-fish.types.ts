import { FishEntity } from '../../bestiary/fish/fish.types';

export type InventoryFishEntity = TAddInventoryFish &
  Pick<
    FishEntity,
    'description' | 'imageUrl' | 'rarity' | 'type' | 'unavailable'
  > & { caughtTime: string };

export type TAddInventoryFish = {
  id: string;
  weight: number;
  length: number;
  sellPrice: number;
  fishId: string;
  userId: string;
  isSold: boolean;
  caughtTime: string;
};

export type TInventoryFishRow = Omit<
  InventoryFishEntity,
  'sellPrice' | 'fishId' | 'userId' | 'imageUrl' | 'isSold' | 'caughtTime'
> & {
  sell_price: number;
  fish_id: string;
  user_id: string;
  image_url: string;
  is_sold: boolean;
  caught_time: string;
};
