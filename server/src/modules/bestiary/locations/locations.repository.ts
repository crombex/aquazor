import { Pool } from 'pg';
import { DB_POOL } from '../../database/database.types';
import { Inject } from '@nestjs/common';
import { TAddLocationForUser, TLocationRow } from './locations.types';

export class LocationsRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async findOneById(id: string) {
    const query = await this.pool.query<TLocationRow>(
      `SELECT 
        id,
        type,
        title,
        fertility,
        image_url,
        description,
        level_required,
        unavailable,
        price
      FROM locations WHERE id = $1`,
      [id],
    );
    if (query.rows.length > 0) {
      return query.rows[0];
    } else {
      return null;
    }
  }

  async addForUser({ locationId, userId, connection }: TAddLocationForUser) {
    const sqlQuery =
      'INSERT INTO users_locations (user_id, location_id) VALUES ($1, $2)';
    if (connection) {
      await connection.query(sqlQuery, [userId, locationId]);
    } else {
      await this.pool.query(sqlQuery, [userId, locationId]);
    }
  }

  async hasUserLocation(userId: string, locationId: string) {
    const result = await this.pool.query(
      'SELECT * FROM users_locations WHERE user_id = $1 AND location_id = $2',
      [userId, locationId],
    );
    return result.rows.length !== 0 ? true : false;
  }
}
