export interface FishEntity {
  id: string;
  type: string;
  maxWeight: number;
  minWeight: number;
  maxLength: number;
  minLength: number;
  maxChance: number;
  minChance: number;
  imageUrl: string;
  description: string;
  rarity: string;
  deprecated: boolean;
}

export type TFishInDatabase = Pick<FishEntity, 'id' | 'deprecated' | 'description' | 'rarity' | 'type'> & {
  max_weight: number;
  min_weight: number;
  max_length: number;
  min_length: number;
  max_chance: number;
  min_chance: number;
  image_url: number;
};

export type TFishFewData = Pick<
  FishEntity,
  'id' | 'type' | 'rarity' | 'description' | 'imageUrl'
>;


