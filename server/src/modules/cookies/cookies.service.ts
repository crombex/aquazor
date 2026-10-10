import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICookieOptions } from './cookie.types';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class CookiesService {
  private accessTokenCookieMaxAge: number;
  private refreshTokenCookieMaxAge: number;

  private defaultCookieOptions: ICookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'PROD'
  };

  constructor(private configService: ConfigService) {
    this.accessTokenCookieMaxAge = ms(
      this.configService.getOrThrow('ACCESS_TOKEN_EXP') as ms.StringValue,
    );
    this.refreshTokenCookieMaxAge = ms(
      this.configService.getOrThrow('REFRESH_TOKEN_EXP') as ms.StringValue,
    );
  }

  setAccessTokenCookie(res: Response, value: string, options: ICookieOptions = this.defaultCookieOptions) {
    res.cookie('accessToken', value, {...options, maxAge: this.accessTokenCookieMaxAge})
  }

  setRefreshTokenCookie(res: Response, value: string, options: ICookieOptions = this.defaultCookieOptions) {
    res.cookie('refreshToken', value, {...options, maxAge: this.refreshTokenCookieMaxAge, path: '/api/auth/refresh-token'})
  }
}
