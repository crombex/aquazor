import { Pool } from 'pg';
import { DB_POOL } from '../database/types';
import { Inject } from '@nestjs/common';
import { TLocationInDatabase } from './locations.types';

export class LocationsRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async findOneById(id: string) {
    const query = await this.pool.query<TLocationInDatabase>(
      `SELECT 
        id,
        type,
        title,
        fertility,
        image_url,
        description,
        level_required,
        deprecated 
      FROM locations WHERE id = $1`,
      [id],
    );
    if (query.rows.length > 0) {
      return query.rows[0];
    } else {
      return null;
    }
  }
}
