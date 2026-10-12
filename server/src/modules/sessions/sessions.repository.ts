import { Pool } from 'pg';
import { Inject, Injectable } from '@nestjs/common';
import { DB_POOL } from '../database/types';
import { IAuthSessionInDatabase, ICreateAuthSession } from './sessions.types'

@Injectable()
export class SessionsRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async createSession({
    userId,
    userDevice,
    sessionExpiresAt,
  }: ICreateAuthSession) {
    const result = await this.pool.query<{ id: string }>(
      `INSERT INTO user_sessions (user_id, device, expired_at) VALUES ($1, $2, $3) RETURNING id`,
      [userId, userDevice, sessionExpiresAt],
    );
    return result.rows[0].id;
  }

  async findSession(sid: string) {
    const session = await this.pool.query<IAuthSessionInDatabase>(
      `SELECT * FROM user_sessions WHERE id = $1`,
      [sid],
    );
    return session.rows.length > 0 ? session.rows[0] : null
  }

  async removeSession(userId: string, userDevice: string) {
    await this.pool.query(
      `DELETE FROM user_sessions WHERE user_id = $1 AND device = $2`,
      [userId, userDevice],
    );
  }

  async removeSessionById(id: string) {
      await this.pool.query(
        `DELETE FROM user_sessions WHERE id = $1`,
        [id],
      );
  }

  async removeAllSessions(userId: string) {
    await this.pool.query(`DELETE FROM user_sessions WHERE user_id = $1`, [
      userId,
    ]);
  }
}
