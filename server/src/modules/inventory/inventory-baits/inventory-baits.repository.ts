import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DB_POOL } from '../../database/database.types';
import {
  TAddInventoryBait,
  TChangeInvenoryBaitsAmount,
  TInventoryBaitRow,
} from './inventory-baits.types';
import { TAddInventoryItem } from '../common/inventory.types';

@Injectable()
export class InventoryBaitsRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async getAllUserBaits(userId: string): Promise<TInventoryBaitRow[]> {
    const sqlQuery = `
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
    const result = await this.pool.query<TInventoryBaitRow>(sqlQuery, [userId]);
    return result.rows;
  }

  async addBait({
    item: { id, baitId, quantity },
    userId,
    connection,
  }: TAddInventoryItem<TAddInventoryBait>) {
    const sqlQuery = `
      INSERT INTO inventory_baits
        (id, user_id, bait_id, quantity) VALUES
        ($1, $2, $3, $4)
        `;
    const argsArray = [id, userId, baitId, quantity];
    if (connection) {
      await connection.query(sqlQuery, argsArray);
    } else {
      await this.pool.query(sqlQuery, argsArray);
    }
  }

  async findOneById(id: string) {
    const result = await this.pool.query<TInventoryBaitRow>(
      `
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
      WHERE ib.id = $1
      `,
      [id],
    );
    if (result.rows.length === 0) {
      return null;
    } else {
      return result.rows[0];
    }
  }

  async changeBaitsAmount({
    id,
    amount,
    connection,
  }: TChangeInvenoryBaitsAmount) {
    const sqlQuery = `UPDATE inventory_baits SET quantity = quantity + $1 WHERE id = $2`;
    if (connection) {
      await connection.query(sqlQuery, [amount, id]);
    } else {
      await this.pool.query(sqlQuery, [amount, id]);
    }
  }
}
