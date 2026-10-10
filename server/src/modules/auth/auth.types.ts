import { JwtPayload } from 'jsonwebtoken';
import { RegisterUserDTO } from '../users/dto/register-user.dto';
import { Roles, TUserInfoFromDB } from '../users/users.types';

export interface ICreateAccessToken {
  userId: string;
  roles: Roles[];
  userSessionId: string;
}

export interface ICreateRefreshToken {
  userId: string;
  userSessionId: string;
}

export type TAccessTokenBody = {
  sub: string;
  exp: number;
  sid: string;
  roles: Roles[];
} & JwtPayload;

export type TRefreshTokenBody = {
  sub: string;
  exp: number;
  sid: string;
} & JwtPayload;

export interface TUserInRequest {
  sub: string;
  roles?: Roles[];
  sid: string;
}

export type TAuthCookies = {
  accessToken?: string;
  refreshToken?: string;
};

export interface ICreateSession {
  userId: string;
  userDevice: string;
  sessionExpiresAt: string;
}

export type TRegisterData = Omit<RegisterUserDTO, 'password'> & {
  passwordHash: string;
};

export type TLoginData = {
  emailOrNickname: string;
  passwordHash: string;
};
