import { Pool } from 'pg';
import { DB_POOL } from '../database/types';
import { Inject } from '@nestjs/common';
import { TFishermanInDatabase } from './fishermen.types';

export class FishermenRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async findOneById(id: string) {
    const query = await this.pool.query<TFishermanInDatabase>(
      `SELECT 
        id,
        name,
        age,
        skill,
        luck,
        description,
        avatar_url,
        deprecated 
      FROM fishermen WHERE id = $1`,
      [id],
    );
    if (query.rows.length > 0) {
      return query.rows[0];
    } else {
      return null;
    }
  }
}
