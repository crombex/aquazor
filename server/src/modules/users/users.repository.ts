import { DB_POOL } from '../database/types';
import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { TRegisterData } from '../auth/auth.types';
import { TUserInDatabase } from './users.types';

@Injectable()
export class UsersRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async createUser(accountInfo: TRegisterData) {
    const client = await this.pool.connect();
    const { passwordHash, email, birthdate, nickname, avatarUrl } = accountInfo;
    let accountUUID: string;

    try {
      await client.query('BEGIN');
      accountUUID = (
        await client.query<{ id: string }>(
          `INSERT INTO 
            users (password_hash, email, birthdate, nickname, avatar_url)
          VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
          [passwordHash, email, birthdate, nickname, avatarUrl],
        )
      ).rows[0].id;
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Error while creating user account: ${error}`);
    } finally {
      client.release();
    }

    return accountUUID;
  }

  async findOneBy({
    id,
    email,
    nickname,
  }: {
    id?: string;
    email?: string;
    nickname?: string;
  }) {
    const result = await this.pool.query<TUserInDatabase>(
      `SELECT * FROM users WHERE id = $1 OR email = $2 OR nickname = $3`,
      [id, email, nickname],
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  }
}
