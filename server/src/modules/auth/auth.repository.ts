import { Pool } from 'pg';
import { Inject, Injectable } from '@nestjs/common';
import { DB_POOL } from '../database/types';
import { ICreateSession } from './auth.types';

@Injectable()
export class AuthRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async createSession({
    userId,
    userDevice,
    sessionExpiresAt,
  }: ICreateSession) {
    const result = await this.pool.query<{ id: string }>(
      `INSERT INTO user_sessions (user_id, device, expired_at) VALUES ($1, $2, $3) RETURNING id`,
      [userId, userDevice, sessionExpiresAt],
    );
    return result.rows[0].id;
  }

  async checkSession(sid: string) {
    const session = await this.pool.query(
      `SELECT * FROM user_sessions WHERE id = $1`,
      [sid],
    );
    return session.rows.length > 0 ? true : false;
  }

  async removeSession(userId: string, userDevice: string) {
    await this.pool.query(`DELETE FROM user_sessions WHERE user_id = $1 AND device = $2`, [userId, userDevice])
  }

  async removeAllSessions(userId: string) {
    await this.pool.query(`DELETE FROM user_sessions WHERE user_id = $1`, [userId])
  }
}
