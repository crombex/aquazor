import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { TUserInRequest } from './auth.types';

export const UseUser = createParamDecorator(
  (field: keyof TUserInRequest, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;
    return field ? user?.[field] : user;
  },
);
