import { Pool } from 'pg';
import { DB_POOL } from '../../database/database.types';
import { Inject } from '@nestjs/common';
import { TFishInDatabase } from './fish.types';

export class FishRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async findOneById(id: string) {
    const query = await this.pool.query<TFishInDatabase>(
      `SELECT 
        id,
        type,
        max_weight,
        min_weight,
        max_length,
        min_length,
        min_probability,
        max_probability,
        image_url,
        description,
        rarity,
        min_sell_price,
        unavailable 
      FROM fish WHERE id = $1`,
      [id],
    );
    if (query.rows.length > 0) {
      return query.rows[0];
    } else {
      return null;
    }
  }
}
