export interface RodEntity {
  id: string;
  type: string;
  efficiency: number;
  power: number;
  imageUrl: string;
  description: string;
  rarity: string;
  deprecated: boolean;
}

export type TRodInDatabase = Omit<RodEntity, 'imageUrl'> & {
  image_url: string;
};

export type TRodFewData = Pick<
  RodEntity,
  'id' | 'type' | 'rarity' | 'description' | 'imageUrl'
>;


