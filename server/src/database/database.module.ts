import {Module} from '@nestjs/common';
import { Pool } from 'pg';
import {ConfigService} from '@nestjs/config';
import { DB_POOL } from './constants';

@Module({
  imports: [ConfigService],
  providers: [
    {
      provide: DB_POOL,
      useFactory: (configService: ConfigService) => {
        return new Pool({
          host: configService.get('DB_HOST'),
          port: Number(configService.get('DB_PORT')) ?? 5432,
          user: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
        });
      }
    }
  ],
  exports: [DB_POOL],
})
export class DatabaseModule {}