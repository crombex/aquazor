import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { TAuthCookies } from '../cookies/cookies.types';
import { SessionsService } from '../sessions/sessions.service';
import { TokensService } from '../tokens/tokens.service';
import { TAccessTokenBody } from '../tokens/tokens.types';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/users.types';

@Injectable()
export class AuthGuard implements CanActivate {
  JWTSecret: string;
  constructor(
    private tokensService: TokensService,
    private configService: ConfigService,
    private sessionsService: SessionsService,
    private usersService: UsersService,
  ) {
    this.JWTSecret = this.configService.getOrThrow('JWT_SECRET');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { accessToken } = request.cookies as TAuthCookies;

    if (!accessToken) {
      throw new UnauthorizedException('Authorization cookie is missing');
    }
    const decodedAccessToken =
      this.tokensService.verifyToken<TAccessTokenBody>(accessToken)!;
    const user = (await this.usersService.findOneById(decodedAccessToken.sub, {
      includeSensitiveData: true,
    })) as UserEntity;
    if (user.isBlocked) {
      throw new ForbiddenException('User with this id is blocked');
    } else if (user.isDeleted) {
      throw new ForbiddenException('User with this id was deleted');
    }
    await this.sessionsService.findSession(decodedAccessToken.sid);
    request.user = {
      sub: decodedAccessToken.sub,
      roles: decodedAccessToken.roles,
      sid: decodedAccessToken.sid,
    };
    return true;
  }
}
