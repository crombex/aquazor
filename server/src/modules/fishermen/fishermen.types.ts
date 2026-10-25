export interface FishermanEntity {
  id: string;
  name: string;
  age: number;
  skill: number;
  luck: number;
  avatarUrl: string;
  description: string;
  deprecated: boolean;
}

export type TFishermanInDatabase = Omit<FishermanEntity, 'avatarUrl'> & {
  avatar_url: string;
};

export type TFishermanFewData = Pick<
  FishermanEntity,
  'id' | 'name' | 'age' | 'description' | 'avatarUrl'
>;
