import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DB_POOL } from '../../database/database.types';
import {
  TAddInventoryRod,
  TInventoryRodFromDatabase,
} from './inventory-rods.types';
import { TAddInventoryItem } from '../common/inventory.types';

@Injectable()
export class InventoryRodsRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async getAllUserRods(userId: string): Promise<TInventoryRodFromDatabase[]> {
    let sqlQuery = `
      SELECT 
        ir.id,
        ir.user_id,
        ir.rod_id,
        ir.started_at,
        ir.finished_at,
        r.type,
        r.rarity,
        r.efficiency,
        r.image_url,
        r.description,
        r.power,
        r.buy_price,
        r.sell_price,
        r.level_required,
        r.unavailable
      FROM inventory_rods AS ir
      LEFT JOIN rods AS r ON r.id = ir.rod_id
      WHERE ir.user_id = $1
      ORDER BY r.type ASC
    `;
    const result = await this.pool.query<TInventoryRodFromDatabase>(sqlQuery, [
      userId,
    ]);
    return result.rows;
  }

  // async addRod({
  //   userId,
  //   item,
  //   connection,
  // }: TAddInventoryItem<TAddInventoryRod>) {
  //   if (connection) {
  //     await connection.query(
  //       `INSERT INTO inventory_fish (id, user_id, fish_id, )`,
  //     );
  //   }
  // }
}
