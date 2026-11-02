export interface LocationEntity {
  id: string;
  type: string;
  title: string;
  fertility: number;
  imageUrl: string;
  description: string;
  levelRequired: number;
  unavailable: boolean;
}

export type TLocationInDatabase = Omit<
  LocationEntity,
  'imageUrl' | 'levelRequired'
> & {
  image_url: string;
  level_required: number;
};

