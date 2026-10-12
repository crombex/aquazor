import { Module } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { SessionsModule } from "../sessions/sessions.module";
import { TokensModule } from "../tokens/tokens.module";

@Module({
  imports: [SessionsModule, TokensModule],
  providers: [AuthGuard],
  exports: [AuthGuard]
})
export class AuthGuardModule {}