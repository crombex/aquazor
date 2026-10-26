export interface FishermanEntity {
  id: string;
  name: string;
  age: number;
  skill: number;
  luck: number;
  avatarUrl: string;
  description: string;
  levelRequired: number;
  deprecated: boolean;
}

export type TFishermanInDatabase = Omit<FishermanEntity, 'avatarUrl' | 'levelRequired'> & {
  avatar_url: string;
  level_required: number;
};

export type TFishermanFewData = Pick<
  FishermanEntity,
  'id' | 'name' | 'age' | 'description' | 'avatarUrl'
>;
