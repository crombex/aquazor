import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class CookiesService {
  private accessTokenCookieMaxAge: number;
  private refreshTokenCookieMaxAge: number;

  private defaultCookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'PROD',
  };

  constructor(private configService: ConfigService) {
    this.accessTokenCookieMaxAge = ms(
      this.configService.getOrThrow('ACCESS_TOKEN_EXP') as ms.StringValue, // eslint-disable-line @typescript-eslint/no-unnecessary-type-assertion
    );
    this.refreshTokenCookieMaxAge = ms(
      this.configService.getOrThrow('REFRESH_TOKEN_EXP') as ms.StringValue, // eslint-disable-line @typescript-eslint/no-unnecessary-type-assertion
    );
  }

  setAccessTokenCookie(
    res: Response,
    value: string,
    options: CookieOptions = this.defaultCookieOptions,
  ) {
    res.cookie('accessToken', value, {
      ...options,
      maxAge: this.accessTokenCookieMaxAge,
    });
  }

  setRefreshTokenCookie(
    res: Response,
    value: string,
    options: CookieOptions = this.defaultCookieOptions,
  ) {
    res.cookie('refreshToken', value, {
      ...options,
      maxAge: this.refreshTokenCookieMaxAge,
      path: '/api/auth/refresh-token',
    });
  }
}
