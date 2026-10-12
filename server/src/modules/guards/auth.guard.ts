import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { TAuthCookies } from '../cookies/cookie.types';
import { SessionsService } from '../sessions/sessions.service';
import { TokensService } from '../tokens/tokens.service';
import { TAccessTokenBody, TRefreshTokenBody } from '../tokens/tokens.types';

@Injectable()
export class AuthGuard implements CanActivate {
  JWTSecret: string;
  constructor(
    private tokensService: TokensService,
    private configService: ConfigService,
    private sessionsService: SessionsService,
  ) {
    this.JWTSecret = this.configService.getOrThrow('JWT_SECRET');
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { accessToken, refreshToken } = request.cookies as TAuthCookies;

    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException('Authorization cookie is missing');
    } else if (refreshToken) {
      const decodedRefreshToken =
        this.tokensService.verifyToken<TRefreshTokenBody>(refreshToken)!;
      try {
        if (await this.sessionsService.checkSession(decodedRefreshToken.sid)) {
          request.user = {
            sub: decodedRefreshToken.sub,
            sid: decodedRefreshToken.sid,
          };
          return true;
        }
      } catch (error) {
        throw new UnauthorizedException(`Error while checking token: ${error}`);
      }
    } else if (accessToken) {
      const decodedAccessToken =
        this.tokensService.verifyToken<TAccessTokenBody>(accessToken)!;
      try {
        if (await this.sessionsService.checkSession(decodedAccessToken.sid)) {
          request.user = {
            sub: decodedAccessToken.sub,
            roles: decodedAccessToken.roles,
            sid: decodedAccessToken.sid,
          };
          return true;
        }
      } catch (error) {
        throw new UnauthorizedException(`Error while checking token: ${error}`);
      }
    }
  }
}
