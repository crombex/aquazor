import { Module } from "@nestjs/common";
import { MigrationManagerService } from "./migration-manager.service";

@Module({
  providers: [MigrationManagerService],
  exports: [MigrationManagerService]
})
export class MigrationManagerModule {}