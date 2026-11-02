import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DB_POOL } from '../../database/database.types';
import {
  IGetUserInventoryOptions,
  IGetUserInventoryOptionsTransaction,
} from '../common/inventory.types';
import { TInventoryFishInDatabase } from './inventory-baits.types';

@Injectable()
export class InventoryFishRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async getInventoryFish(
    params: IGetUserInventoryOptions,
  ): Promise<TInventoryFishInDatabase[]>;
  async getInventoryFish(
    params: IGetUserInventoryOptionsTransaction,
  ): Promise<void>;

  async getInventoryFish(
    params: IGetUserInventoryOptions | IGetUserInventoryOptionsTransaction,
  ): Promise<any> {
    const { limit, offset, userId } = params;
    let sqlQuery = `
      SELECT 
        infi.id,
        infi.user_id,
        infi.fish_id,
        infi.weight,
        infi.length,
        infi.description,
        infi.sell_price
      FROM inventory_fish AS infi
      LEFT JOIN fish ON fish.id = infi.fish_id
      WHERE infi.user_id = $1
      ORDER BY fish.type ASC
      LIMIT $2
      OFFSET $3
    `;
    if ('connection' in params && params.connection) {
      await params.connection.query(sqlQuery, [userId, limit, offset]);
    } else {
      const { rows } = await this.pool.query<TInventoryFishInDatabase>(
        sqlQuery,
        [userId, limit, offset],
      );
      return rows;
    }
  }
}
