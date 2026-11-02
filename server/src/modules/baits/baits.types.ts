export interface BaitEntity {
  id: string;
  type: string;
  rarity: string;
  imageUrl: string;
  description: string;
  efficiency: number;
  buyPrice: number;
  sellPrice: number;
  levelRequired: number;
  unavailable: boolean;
}

export type TBaitInDatabase = Omit<
  BaitEntity,
  'avatarUrl' | 'levelRequired' | 'sellPrice' | 'buyPrice'
> & {
  avatar_url: string;
  level_required: number;
  sell_price: number;
  buy_price: number;
};

