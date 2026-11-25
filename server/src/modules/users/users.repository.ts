import { DB_POOL } from '../database/database.types';
import { Inject, Injectable } from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';
import { TRegisterData } from '../auth/auth.types';
import {
  TChangeUserCoinsAmount,
  TChangeUserExperienceAmount,
  TUserRow,
} from './users.types';

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
    connection,
  }: {
    id?: string;
    email?: string;
    nickname?: string;
    connection?: PoolClient;
  }) {
    const sqlQuery = `SELECT * FROM users WHERE id = $1 OR email = $2 OR nickname = $3`;
    let result: QueryResult<TUserRow>;
    if (connection) {
      result = await connection.query<TUserRow>(sqlQuery, [
        id,
        email,
        nickname,
      ]);
    } else {
      result = await this.pool.query<TUserRow>(sqlQuery, [id, email, nickname]);
    }

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  }

  async changeCoinsAmount({
    userId,
    amount,
    connection,
  }: TChangeUserCoinsAmount) {
    const sqlQuery = `UPDATE users SET coins = coins + $1 WHERE id = $2`;
    if (connection) {
      await connection.query(sqlQuery, [amount, userId]);
    } else {
      await this.pool.query(sqlQuery, [amount, userId]);
    }
  }

  async changeExperienceAmount({
    userId,
    amount,
    connection,
  }: TChangeUserExperienceAmount) {
    const sqlQuery = `UPDATE users SET experience = experience + $1 WHERE id = $2`;
    if (connection) {
      await connection.query(sqlQuery, [amount, userId]);
    } else {
      await this.pool.query(sqlQuery, [amount, userId]);
    }
  }
}
