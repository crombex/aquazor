export type FishermanEntity = {
  id: string;
  name: string;
  age: number;
  skill: number;
  luck: number;
  avatarUrl: string;
  description: string;
  levelRequired: number;
  unavailable: boolean;
}

export type TFishermanInDatabase = Omit<
  FishermanEntity,
  'avatarUrl' | 'levelRequired'
> & {
  avatar_url: string;
  level_required: number;
};

