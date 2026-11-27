import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DB_POOL } from '../../database/database.types';
import {
  TAddInventoryFish,
  TInventoryFishRow,
} from '../inventory-fish/inventory-fish.types';
import {
  TAddInventoryItem,
  TRemoveInventoryItem,
} from '../common/inventory.types';
@Injectable()
export class InventoryFishRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async getAllUserFish(userId: string): Promise<TInventoryFishRow[]> {
    const sqlQuery = `
      SELECT 
        infi.id,
        infi.user_id,
        infi.fish_id,
        infi.weight,
        infi.length,
        infi.sell_price,
        infi.is_sold,
        infi.caught_time,
        fish.description,
        fish.image_url,
        fish.type,
        fish.rarity,
        fish.unavailable
      FROM inventory_fish AS infi
      LEFT JOIN fish ON fish.id = infi.fish_id
      WHERE infi.user_id = $1
      ORDER BY fish.type ASC
    `;
    const result = await this.pool.query<TInventoryFishRow>(sqlQuery, [userId]);
    return result.rows;
  }

  async addFish({
    item: { id, fishId, weight, length, sellPrice, caughtTime },
    userId,
    connection,
  }: TAddInventoryItem<TAddInventoryFish>) {
    const sqlQuery = `
      INSERT INTO inventory_fish 
        (id, user_id, fish_id, weight, length, sell_price, caught_time) VALUES
        ($1, $2, $3, $4, $5, $6, $7)
        `;
    const argsArray = [
      id,
      userId,
      fishId,
      weight,
      length,
      sellPrice,
      caughtTime,
    ];
    if (connection) {
      await connection.query(sqlQuery, argsArray);
    } else {
      await this.pool.query(sqlQuery, argsArray);
    }
  }

  async findOneById(id: string) {
    const result = await this.pool.query<TInventoryFishRow>(
      `
      SELECT
        infi.id,
        infi.user_id,
        infi.fish_id,
        infi.weight,
        infi.length,
        infi.sell_price,
        infi.is_sold,
        infi.caught_time,
        f.description,
        f.image_url,
        f.type,
        f.rarity,
        f.unavailable
      FROM inventory_fish AS infi
      LEFT JOIN fish AS f ON f.id = infi.fish_id
      WHERE infi.id = $1
      `,
      [id],
    );
    if (result.rows.length === 0) {
      return null;
    } else {
      return result.rows[0];
    }
  }

  async writeOffFish({ id, connection }: TRemoveInventoryItem) {
    const sqlQuery = `UPDATE inventory_fish SET is_sold = TRUE WHERE id = $1`;
    if (connection) {
      await connection.query(sqlQuery, [id]);
    } else {
      await this.pool.query(sqlQuery, [id]);
    }
  }
}
