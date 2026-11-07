import { PoolClient } from "pg";

export enum EInventoryCategories {
  FISH = 'fish',
  RODS = 'rods',
  BAITS = 'baits',
  FISHERMEN = 'fishermen',
}

export interface IGetUserInventoryOptions {
  userId: string;
  category: EInventoryCategories;
}

export type TAddInventoryItem<T> = {
  item: T;
  userId: string;
  connection?: PoolClient;
};
