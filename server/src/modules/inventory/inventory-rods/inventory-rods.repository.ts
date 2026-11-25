import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { DB_POOL } from '../../database/database.types';
import { TAddInventoryRod, TInventoryRodRow } from './inventory-rods.types';
import { TAddInventoryItem } from '../common/inventory.types';

@Injectable()
export class InventoryRodsRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async getAllUserRods(userId: string): Promise<TInventoryRodRow[]> {
    const sqlQuery = `
      SELECT 
        ir.id,
        ir.user_id,
        ir.rod_id,
        ir.started_at,
        ir.finished_at,
        ir.status,
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
    const result = await this.pool.query<TInventoryRodRow>(sqlQuery, [userId]);
    return result.rows;
  }

  async addRod({
    item: { id, rodId, status },
    userId,
    connection,
  }: TAddInventoryItem<TAddInventoryRod>) {
    const sqlQuery = `
      INSERT INTO inventory_rods
        (id, user_id, rod_id, status) VALUES
        ($1, $2, $3, $4)
        `;
    const argsArray = [id, userId, rodId, status];
    if (connection) {
      await connection.query(sqlQuery, argsArray);
    } else {
      await this.pool.query(sqlQuery, argsArray);
    }
  }

  async findOneById(id: string) {
    const result = await this.pool.query<TInventoryRodRow>(
      `
      SELECT 
        ir.id,
        ir.user_id,
        ir.rod_id,
        ir.started_at,
        ir.finished_at,
        ir.status,
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
      WHERE ir.id = $1
      `,
      [id],
    );
    if (result.rows.length === 0) {
      return null;
    } else {
      return result.rows[0];
    }
  }

  async markBusy(
    {
      rodId,
      startedAt,
      finishedAt,
    }: { rodId: string; startedAt: string; finishedAt: string },
    connection: PoolClient,
  ) {
    const result = await connection.query(
      `UPDATE inventory_rods SET status = 'busy', started_at = $1, finished_at = $2 WHERE id = $3 AND status = 'free' AND (finished_at <= NOW() OR finished_at IS NULL)`,
      [startedAt, finishedAt, rodId],
    );
    if (result.rowCount === 0) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async markFree(rodId: string, connection: PoolClient) {
    const result = await connection.query(
      `UPDATE inventory_rods SET status = 'free' WHERE id = $1 AND status = 'busy' AND finished_at <= NOW()`,
      [rodId],
    );
    if (result.rowCount === 0) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
