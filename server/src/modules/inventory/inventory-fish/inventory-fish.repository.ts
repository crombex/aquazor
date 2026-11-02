import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DB_POOL } from '../../database/database.types';
import { IGetUserInventoryOptions } from '../common/inventory.types';
import {
  TAddInventoryFish,
  TInventoryFishInDatabase,
} from './inventory-fish.types';

@Injectable()
export class InventoryFishRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async getAllFish({
    limit,
    offset,
    userId,
    connection,
  }: IGetUserInventoryOptions): Promise<TInventoryFishInDatabase[] | void> {
    let sqlQuery = `
      SELECT 
        infi.id,
        infi.user_id,
        infi.fish_id,
        infi.weight,
        infi.length,
        infi.description,
        infi.sell_price,
        fish.image_url,
        fish.type,
        fish.rarity,
        fish.unavailable
      FROM inventory_fish AS infi
      LEFT JOIN fish ON fish.id = infi.fish_id
      WHERE infi.user_id = $1
      ORDER BY fish.type ASC
      LIMIT $2
      OFFSET $3
    `;
    if (connection) {
      await connection.query(sqlQuery, [userId, limit, offset]);
    } else {
      const { rows } = await this.pool.query<TInventoryFishInDatabase>(
        sqlQuery,
        [userId, limit, offset],
      );
      return rows;
    }
  }

  async addFish({
    userId,
    fish,
    connection,
  }: TAddInventoryFish): Promise<void | string> {
    if (connection) {
      await connection.query(
        `INSERT INTO inventory_fish (id, user_id, fish_id, )`,
      );
    }
  }
}
