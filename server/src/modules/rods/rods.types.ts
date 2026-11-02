export interface RodEntity {
  id: string;
  type: string;
  efficiency: number;
  power: number;
  imageUrl: string;
  description: string;
  rarity: string;
  unavailable: boolean;
  buyPrice: number;
  sellPrice: number;
  levelRequired: number;
}

export type TRodInDatabase = Omit<
  RodEntity,
  'imageUrl' | 'buyPrice' | 'sellPrice' | 'levelRequired'
> & {
  image_url: string;
  buy_price: number;
  sell_price: number;
  level_required: number;
};
