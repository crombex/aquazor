import { FishEntity } from '../../bestiary/fish/fish.types';

export type InventoryFishEntity = TAddInventoryFish & Pick<
  FishEntity,
  'description' | 'imageUrl' | 'rarity' | 'type' | 'unavailable'
>;

export type TAddInventoryFish = {
  id: string;
  weight: number;
  length: number;
  sellPrice: number;
  fishId: string;
  userId: string;
  isSold: boolean;
};

export type TInventoryFishFromDatabase = Omit<
  InventoryFishEntity,
  'sellPrice' | 'fishId' | 'userId' | 'imageUrl' | 'isSold'
> & {
  sell_price: number;
  fish_id: string;
  user_id: string;
  image_url: string;
  is_sold: boolean;
};
