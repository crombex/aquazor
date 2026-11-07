import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DB_POOL } from '../../database/database.types';
import { TAddInventoryBait, TInventoryBaitFromDatabase } from './inventory-baits.types';
import { TAddInventoryItem } from '../common/inventory.types';

@Injectable()
export class InventoryBaitsRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async getAllUserBaits(userId: string): Promise<TInventoryBaitFromDatabase[]> {
    let sqlQuery = `
      SELECT 
        ib.id,
        ib.user_id,
        ib.bait_id,
        ib.quantity,
        b.type,
        b.rarity,
        b.image_url,
        b.description,
        b.efficiency,
        b.buy_price,
        b.sell_price,
        b.level_required,
        b.unavailable
      FROM inventory_baits AS ib
      LEFT JOIN baits AS b ON b.id = ib.bait_id
      WHERE ib.user_id = $1
      ORDER BY b.type ASC
    `;
    const result = await this.pool.query<TInventoryBaitFromDatabase>(sqlQuery, [
      userId,
    ]);
    return result.rows;
  }

  // async addBait({ userId, item, connection }: TAddInventoryItem<TAddInventoryBait>) {
  //   if (connection) {
  //     await connection.query(
  //       `INSERT INTO inventory_fish (id, user_id, fish_id, )`,
  //     );
  //   }
  // }
}
