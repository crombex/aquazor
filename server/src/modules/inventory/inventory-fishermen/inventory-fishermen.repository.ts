import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { DB_POOL } from '../../database/database.types';
import {
  TAddInventoryFisherman,
  TInventoryFishermanRow,
} from './inventory-fishermen.types';
import { TAddInventoryItem } from '../common/inventory.types';

@Injectable()
export class InventoryFishermenRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async getAllUserFishermen(userId: string): Promise<TInventoryFishermanRow[]> {
    const sqlQuery = `
      SELECT 
        inf.id,
        inf.user_id,
        inf.fisherman_id,
        inf.started_at,
        inf.finished_at,
        inf.status,
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
    const result = await this.pool.query<TInventoryFishermanRow>(sqlQuery, [
      userId,
    ]);
    return result.rows;
  }

  async addFisherman({
    item: { id, fishermanId, status },
    userId,
    connection,
  }: TAddInventoryItem<TAddInventoryFisherman>) {
    const sqlQuery = `
      INSERT INTO inventory_fishermen
        (id, user_id, fisherman_id, status) VALUES
        ($1, $2, $3, $4)
        `;
    const argsArray = [id, userId, fishermanId, status];
    if (connection) {
      await connection.query(sqlQuery, argsArray);
    } else {
      await this.pool.query(sqlQuery, argsArray);
    }
  }

  async findOneById(id: string) {
    const result = await this.pool.query<TInventoryFishermanRow>(
      `
      SELECT 
        inf.id,
        inf.user_id,
        inf.fisherman_id,
        inf.started_at,
        inf.finished_at,
        inf.status,
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

  async markBusy(
    {
      fishermanId,
      startedAt,
      finishedAt,
    }: { fishermanId: string; startedAt: string; finishedAt: string },
    connection: PoolClient,
  ) {
    const result = await connection.query(
      `UPDATE inventory_fishermen SET status = 'busy', started_at = $1, finished_at = $2 WHERE id = $3 AND status = 'free' AND (finished_at <= NOW() OR finished_at IS NULL)`,
      [startedAt, finishedAt, fishermanId],
    );
    if (result.rowCount === 0) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async markFree(fishermanId: string, connection: PoolClient) {
    const result = await connection.query(
      `UPDATE inventory_fishermen SET status = 'free' WHERE id = $1 AND status = 'busy' AND finished_at <= NOW()`,
      [fishermanId],
    );
    if (result.rowCount === 0) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
