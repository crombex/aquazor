import { Pool } from 'pg';
import { DB_POOL } from '../database/types';
import { Inject } from '@nestjs/common';
import { TRodInDatabase } from './rods.types';

export class RodsRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async findOneById(id: string) {
    const query = await this.pool.query<TRodInDatabase>(
      `SELECT 
        id,
        type,
        efficiency,
        power,
        image_url,
        description,
        rarity,
        deprecated 
      FROM rods WHERE id = $1`,
      [id],
    );
    if (query.rows.length > 0) {
      return query.rows[0];
    } else {
      return null;
    }
  }
}
