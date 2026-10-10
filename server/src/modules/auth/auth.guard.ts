import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import {
  TAccessTokenBody,
  TAuthCookies,
  TRefreshTokenBody,
} from './auth.types';
import { AuthSessionService } from './auth-session.service';

@Injectable()
export class AuthGuard implements CanActivate {
  JWTSecret: string;
  constructor(
    private configService: ConfigService,
    private sessionService: AuthSessionService,
  ) {
    this.JWTSecret = this.configService.getOrThrow('JWT_SECRET');
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { accessToken, refreshToken } = request.cookies as TAuthCookies;

    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException('Authorization cookie is missing');
    } else if (refreshToken) {
      try {
        const decodedRefreshToken = verify(
          refreshToken,
          this.JWTSecret,
        ) as TRefreshTokenBody;
        if (await this.sessionService.checkSession(decodedRefreshToken.sid)) {
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
      try {
        const decodedAccessToken = verify(
          accessToken,
          this.JWTSecret,
        ) as TAccessTokenBody;
        if (await this.sessionService.checkSession(decodedAccessToken.sid)) {
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
