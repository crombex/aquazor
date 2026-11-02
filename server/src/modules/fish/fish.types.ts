export interface FishEntity {
  id: string;
  type: string;
  maxWeight: number;
  minWeight: number;
  maxLength: number;
  minLength: number;
  maxProbability: number;
  minProbability: number;
  imageUrl: string;
  description: string;
  rarity: string;
  minSellPrice: number;
  unavailable: boolean;
}

export type TFishInDatabase = Pick<
  FishEntity,
  'id' | 'unavailable' | 'description' | 'rarity' | 'type'
> & {
  max_weight: number;
  min_weight: number;
  max_length: number;
  min_length: number;
  max_probability: number;
  min_probability: number;
  image_url: string;
  min_sell_price: number;
};

export type TFishForResponseData = Omit<
  FishEntity,
  'maxProbability' | 'minProbability'
>;
