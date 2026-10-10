import { DB_POOL } from '../database/types';
import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { TRegisterData } from '../auth/auth.types';
import { TUserInfoInDB, TUserInfoFromDB } from './users.types';

@Injectable()
export class UsersRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  private mapRoles(roles: string) {
    return roles.split(';').filter(Boolean);
  }

  async createUser(accountInfo: TRegisterData) {
    const client = await this.pool.connect();
    const { passwordHash, email, birthdate, nickname } = accountInfo;
    let accountUUID: string;

    try {
      await client.query('BEGIN');
      accountUUID = (
        await client.query<{ id: string }>(
          `INSERT INTO 
            users (password_hash, email, birthdate, nickname)
          VALUES ($1, $2, $3, $4) RETURNING id;`,
          [passwordHash, email, birthdate, nickname],
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

  async findOneByEmail(email: string) {
    const result = await this.pool.query<TUserInfoInDB>(
      `SELECT id, email, nickname, roles, password_hash AS "passwordHash" FROM users WHERE email = $1`,
      [email],
    );
    if (result.rows.length > 0) {
      return ({
        ...result.rows[0],
        roles: this.mapRoles(result.rows[0].roles),
      }) as TUserInfoFromDB;
    } else {
      return null
    }
  }

  async findOneByNickname(nickname: string) {
    const user = await this.pool.query<TUserInfoInDB>(
      `SELECT id, email, nickname, roles, password_hash AS "passwordHash" FROM users WHERE nickname = $1`,
      [nickname],
    );
    if (user.rows.length > 0) {
      return ({
        ...user.rows[0],
        roles: this.mapRoles(user.rows[0].roles),
      }) as TUserInfoFromDB;
    } else {
      return null
    }
  }

  async findOneByEmailOrNickname(emailOrNickname: string) {
    const user = await this.pool.query<TUserInfoInDB>(
      `SELECT id, email, nickname, roles, password_hash AS "passwordHash" FROM users WHERE nickname = $1 OR email = $1`,
      [emailOrNickname],
    );
    if (user.rows.length > 0) {
      return ({
        ...user.rows[0],
        roles: this.mapRoles(user.rows[0].roles),
      }) as TUserInfoFromDB;
    } else {
      return null
    }
  }

  async findOneById(id: string) {
    const user = await this.pool.query<TUserInfoInDB>(
      `SELECT id, email, nickname, roles, password_hash AS "passwordHash" FROM users WHERE id = $1`,
      [id],
    );
    if (user.rows.length > 0) {
      return {
        ...user.rows[0],
        roles: this.mapRoles(user.rows[0].roles),
      } as TUserInfoFromDB;
    } else {
      return null
    }
  }
}
