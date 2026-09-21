import { Pool } from 'pg';
import { DB_POOL } from './types';
import { ConfigService } from '@nestjs/config/dist/config.service';

export const DatabaseProvider = {
  provide: DB_POOL,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return new Pool({
      user: configService.getOrThrow<string>('DB_USER'),
      host: configService.getOrThrow<string>('DB_HOST'),
      database: configService.getOrThrow<string>('DB_NAME'),
      password: configService.getOrThrow<string>('DB_PASSWORD'),
      port: Number(configService.getOrThrow<string>('DB_PORT')),
    });
  },
};
