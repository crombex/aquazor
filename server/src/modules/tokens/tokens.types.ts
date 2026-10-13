import { JwtPayload } from 'jsonwebtoken';
import { Roles } from '../users/users.types';

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
