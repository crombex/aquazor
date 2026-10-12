import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDTO } from '../users/dto/register-user.dto';
import { Roles, TUserEntityMapped } from '../users/users.types';
import { TRegisterData, TUserInRequest } from './auth.types';
import { hash, compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { TokensService } from '../tokens/tokens.service';
import { SessionsService } from '../sessions/sessions.service';
import { LoginUserDTO } from './dto/login.dto';
import { UserEntity } from '../users/users.entity';

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
    { email, password, nickname, birthdate }: RegisterUserDTO,
    userDevice?: string,
  ) {
    let userWithThisEmail: TUserEntityMapped | null,
      userWithThisNickname: TUserEntityMapped | null;
    try {
      userWithThisEmail = await this.usersService.findOneByEmail(email);
    } catch (error) {
      userWithThisEmail = null;
    }

    try {
      userWithThisNickname =
        await this.usersService.findOneByNickname(nickname);
    } catch (error) {
      userWithThisNickname = null;
    }

    if (userWithThisEmail !== null) {
      throw new ConflictException('This email address is already taken');
    } else if (userWithThisNickname !== null) {
      throw new ConflictException('This nickname is already taken');
    }

    const hashedPassword = await hash(password, this.bcryptHashRounds);
    const updatedUserInfo: TRegisterData = {
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
      foundUser =
        await this.usersService.findOneByEmailOrNickname(emailOrNickname);
    } catch (error) {
      foundUser = null;
    }

    const passwordToCompare = foundUser
      ? foundUser.passwordHash
      : '\$2b\$15\$abcdefghijklmnopqrstuvwx';
    const compareResult = await compare(password, passwordToCompare);
    if (!foundUser || !compareResult) {
      throw new UnauthorizedException('Wrong email/nickname or password');
    }
    if (!userDevice) {
      throw new UnauthorizedException('Header "User-Agent" needed');
    }

    /**
     * Мы удаляем дубликаты сессий из базы, так как если пользователь почистит куки, то при повторном логине новая сессия добавится, а старая никуда
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

  async refreshToken(user: TUserInRequest) {
    if (!(await this.sessionsService.checkSession(user.sid))) {
      throw new UnauthorizedException('Session does not exist');
    }
    const foundUser = (await this.usersService.findOneById(user.sub))!;
    const newAccessToken = this.tokensService.generateAccessToken({
      userId: user.sub,
      userSessionId: user.sid,
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
