import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import {
  ICreateAccessToken,
  ICreateRefreshToken,
  TRefreshTokenBody,
} from './auth.types';
import { sign, verify } from 'jsonwebtoken';
import { addStringTime } from 'src/utils/date-and-time';
import { AuthSessionService } from './auth-session.service';

@Injectable()
export class AuthTokenService {
  private accessTokenExpiresAt: ms.StringValue;
  private refreshTokenExpiresAt: ms.StringValue;
  private JWTSecret: string;

  constructor(
    private configService: ConfigService,
    private sessionService: AuthSessionService,
  ) {
    this.accessTokenExpiresAt =
      this.configService.getOrThrow<ms.StringValue>('ACCESS_TOKEN_EXP');
    this.refreshTokenExpiresAt =
      this.configService.getOrThrow<ms.StringValue>('REFRESH_TOKEN_EXP');
    this.JWTSecret = this.configService.getOrThrow<string>('JWT_SECRET');
  }

  generateAccessToken({ userId, userSessionId, roles }: ICreateAccessToken) {
    return sign({ sub: userId, sid: userSessionId, roles }, this.JWTSecret, {
      expiresIn: this.accessTokenExpiresAt,
    });
  }

  generateRefreshToken({ userId, userSessionId }: ICreateRefreshToken) {
    return sign({ sub: userId, sid: userSessionId }, this.JWTSecret, {
      expiresIn: this.refreshTokenExpiresAt,
    });
  }

  verifyToken(refreshToken: string) {
    try {
      const decodedToken = verify(
        refreshToken,
        this.JWTSecret,
      ) as TRefreshTokenBody;
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('invalid token');
    }
  }
}
