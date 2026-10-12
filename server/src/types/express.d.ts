import { Request } from 'express';
import { TUserInRequest } from 'src/modules/auth/auth.types';

declare module 'express' {
  interface Request {
    user: TUserInRequest;
  }
}
