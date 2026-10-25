import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDTO } from '../users/dto/register-user.dto';
import { Roles, TUserEntityMapped } from '../users/users.types';
import { TRegisterData } from './auth.types';
import { hash, compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { TokensService } from '../tokens/tokens.service';
import { SessionsService } from '../sessions/sessions.service';
import { LoginUserDTO } from './dto/login.dto';
import { UserEntity } from '../users/users.types';
import { TRefreshTokenBody } from '../tokens/tokens.types';

@Injectable()
export class AuthService {
  private bcryptHashRounds: number;

  constructor(
    private tokensService: TokensService,
    private sessionsService: SessionsService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    this.bcryptHashRounds = Number(this.configService.get('HASH_ROUNDS'));
  }

  async register(
    {
      email,
      password,
      nickname,
      birthdate,
      avatarUrl,
    }: RegisterUserDTO & { avatarUrl?: string },
    userDevice?: string,
  ) {
    let userWithThisEmail: TUserEntityMapped | null,
      userWithThisNickname: TUserEntityMapped | null;
    try {
      userWithThisEmail = await this.usersService.findOneByEmail(email, {
        includeSensitiveData: false,
      });
    } catch {
      userWithThisEmail = null;
    }

    try {
      userWithThisNickname = await this.usersService.findOneByNickname(
        nickname,
        { includeSensitiveData: false },
      );
    } catch {
      userWithThisNickname = null;
    }

    const hashedPassword = await hash(password, this.bcryptHashRounds);

    if (userWithThisEmail !== null) {
      throw new ConflictException('This email address is already taken');
    } else if (userWithThisNickname !== null) {
      throw new ConflictException('This nickname is already taken');
    }

    const updatedUserInfo: TRegisterData = {
      avatarUrl,
      email,
      nickname,
      birthdate,
      passwordHash: hashedPassword,
    };
    const userId = await this.usersService.createUser(updatedUserInfo);
    const userSessionId = await this.sessionsService.createSession(
      userId,
      userDevice ?? 'unknown',
    );
    const accessToken = this.tokensService.generateAccessToken({
      userId,
      userSessionId,
      roles: [Roles.USER],
    });
    const refreshToken = this.tokensService.generateRefreshToken({
      userId,
      userSessionId,
    });

    return { accessToken, refreshToken };
  }

  async login({ emailOrNickname, password }: LoginUserDTO, userDevice: string) {
    let foundUser: UserEntity | null;
    try {
      foundUser = (await this.usersService.findOneByEmailOrNickname(
        emailOrNickname,
        { includeSensitiveData: true },
      )) as UserEntity;
    } catch {
      foundUser = null;
    }

    const passwordToCompare = foundUser
      ? foundUser.passwordHash
      : '$2b$15$abcdefghijklmnopqrstuvwx';
    const compareResult = await compare(password, passwordToCompare);
    if (!foundUser || !compareResult) {
      throw new UnauthorizedException('Wrong email/nickname or password');
    }
    if (!userDevice) {
      throw new UnauthorizedException('Header "User-Agent" needed');
    }
    if (foundUser.isDeleted) {
      throw new ForbiddenException('User with this id was deleted');
    }
    if (foundUser.isBlocked) {
      throw new ForbiddenException('User with this id is blocked');
    }

    /**
     * Мы удаляем дубликаты сессий из базы, так как если пользователь почистит куки, то при повторном логине новая сессия добавится, а старая никуда не исчезнет
     */
    await this.sessionsService.removeSession(foundUser.id, userDevice);

    const sessionId = await this.sessionsService.createSession(
      foundUser.id,
      userDevice,
    );
    const accessToken = this.tokensService.generateAccessToken({
      userId: foundUser.id,
      userSessionId: sessionId,
      roles: foundUser.roles,
    });
    const refreshToken = this.tokensService.generateRefreshToken({
      userId: foundUser.id,
      userSessionId: sessionId,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string | null) {
    if (!refreshToken) {
      throw new UnauthorizedException('Authorization cookie is missing');
    }
    const decodedToken =
      this.tokensService.verifyToken<TRefreshTokenBody>(refreshToken)!;
    await this.sessionsService.findSession(decodedToken.sid);
    const foundUser = (await this.usersService.findOneById(decodedToken.sub, {
      includeSensitiveData: true,
    })) as UserEntity;
    if (foundUser.isBlocked) {
      throw new ForbiddenException('User with this id is blocked');
    } else if (foundUser.isDeleted) {
      throw new ForbiddenException('User with this id was deleted');
    }
    const newAccessToken = this.tokensService.generateAccessToken({
      userId: decodedToken.sub,
      userSessionId: decodedToken.sid,
      roles: foundUser.roles,
    });
    return newAccessToken;
  }

  async logout(userId: string, userDevice: string) {
    await this.sessionsService.removeSession(userId, userDevice);
  }

  async logoutAll(userId: string) {
    await this.sessionsService.removeAllSessions(userId);
  }
}
