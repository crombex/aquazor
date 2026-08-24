import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseProvider } from './database.provider';

@Global()
@Module({
  providers: [DatabaseService, DatabaseProvider],
  exports: [DatabaseProvider],
})
export class DatabaseModule {}
