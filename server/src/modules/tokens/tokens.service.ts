import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import {
  ICreateAccessToken,
  ICreateRefreshToken,
} from './tokens.types';
import { JsonWebTokenError, sign, verify } from 'jsonwebtoken';

@Injectable()
export class TokensService {
  private accessTokenExpiresAt: ms.StringValue;
  private refreshTokenExpiresAt: ms.StringValue;
  private JWTSecret: string;

  constructor(private configService: ConfigService) {
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

  verifyToken<T>(token: string) {
    try {
      const decodedToken = verify(
        token,
        this.JWTSecret
      ) as T;
      return decodedToken;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(error.message);
      }
    }
  }
}
