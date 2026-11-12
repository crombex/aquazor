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

  async getAllUserFishermen(
    userId: string,
  ): Promise<TInventoryFishermanFromDatabase[]> {
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
        f.unavailable,
        f.price
      FROM inventory_fishermen AS inf
      LEFT JOIN fishermen AS f ON f.id = inf.fisherman_id
      WHERE inf.user_id = $1
      ORDER BY f.name ASC
    `;
    const result = await this.pool.query<TInventoryFishermanFromDatabase>(
      sqlQuery,
      [userId],
    );
    return result.rows;
  }

  async addFisherman({
    item: { id, fishermanId },
    userId,
    connection,
  }: TAddInventoryItem<TAddInventoryFisherman>) {
    const sqlQuery = `
      INSERT INTO inventory_fishermen
        (id, user_id, fisherman_id) VALUES
        ($1, $2, $3)
        `;
    const argsArray = [id, userId, fishermanId];
    if (connection) {
      await connection.query(sqlQuery, argsArray);
    } else {
      await this.pool.query(sqlQuery, argsArray);
    }
  }

  async findOneById(id: string) {
    const result = await this.pool.query<TInventoryFishermanFromDatabase>(
      `
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
        f.unavailable,
        f.price
      FROM inventory_fishermen AS inf
      LEFT JOIN fishermen AS f ON f.id = inf.fisherman_id
      WHERE inf.id = $1
      `,
      [id],
    );
    if (result.rows.length === 0) {
      return null;
    } else {
      return result.rows[0];
    }
  }
}
