import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Pool } from 'pg';
import { DB_POOL } from './types';

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  constructor(@Inject(DB_POOL) private readonly pool: Pool) {}

  async onApplicationShutdown(signal?: string) {
    console.log(`Приложение завершает работу из-за сигнала: ${signal}`);
    await this.pool.end();
  }
}
