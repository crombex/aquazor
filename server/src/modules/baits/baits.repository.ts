import { Pool } from 'pg';
import { DB_POOL } from '../database/database.types';
import { Inject } from '@nestjs/common';
import { TBaitInDatabase } from './baits.types';

export class BaitsRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async findOneById(id: string) {
    const query = await this.pool.query<TBaitInDatabase>(
      `SELECT 
        id,
        type,
        efficiency,
        sell_price,
        buy_price,
        description,
        image_url,
        level_required,
        rarity,
        unavailable 
      FROM baits WHERE id = $1`,
      [id],
    );
    if (query.rows.length > 0) {
      return query.rows[0];
    } else {
      return null;
    }
  }
}
