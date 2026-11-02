import { Injectable, Inject } from '@nestjs/common';
import { DB_POOL } from '../database/database.types';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class MigrationManagerService {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async run(callback: (client: PoolClient) => Promise<void>) {
    const connection = await this.pool.connect();
    try {
      await connection.query('BEGIN');
      await callback(connection);
      await connection.query('COMMIT');
    } catch (error) {
      await connection.query('ROLLBACK');
      throw error;
    } finally {
      connection.release();
    }
  }
}
