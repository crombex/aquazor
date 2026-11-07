import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DB_POOL } from '../../database/database.types';
import {
  TAddInventoryFisherman,
  TInventoryFishermanFromDatabase,
} from './inventory-fishermen.types';
import { TAddInventoryItem } from '../common/inventory.types';

@Injectable()
export class InventoryFishermenRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async getAllUserFishermen(userId: string): Promise<TInventoryFishermanFromDatabase[]> {
    let sqlQuery = `
      SELECT 
        inf.id,
        inf.user_id,
        inf.fisherman_id,
        inf.started_at,
        inf.finished_at,
        inf.energy,
        f.name,
        f.age,
        f.skill,
        f.avatar_url,
        f.description,
        f.luck,
        f.level_required,
        f.unavailable
      FROM inventory_fishermen AS inf
      LEFT JOIN fishermen AS f ON f.id = inf.fisherman_id
      WHERE if.user_id = $1
      ORDER BY f.name ASC
    `;
    const result = await this.pool.query<TInventoryFishermanFromDatabase>(sqlQuery, [
      userId,
    ]);
    return result.rows;
  }

  // async addFisherman({
  //   userId,
  //   item,
  //   connection,
  // }: TAddInventoryItem<TAddInventoryFisherman>) {
  //   if (connection) {
  //     await connection.query(
  //       `INSERT INTO inventory_fish (id, user_id, fish_id, )`,
  //     );
  //   }
  // }
}
