import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { RegisterUserDTO } from '../users/dto/register-user.dto';
import { Roles, TUserInfoFromDB } from '../users/users.types';
import { TLoginData, TRegisterData, TUserInRequest } from './auth.types';
import { hash, compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { AuthTokenService } from './auth-token.service';
import { AuthSessionService } from './auth-session.service';
import { LoginUserDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  private bcryptHashRounds: number;

  constructor(
    private authRepository: AuthRepository,
    private authTokenService: AuthTokenService,
    private authSessionService: AuthSessionService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    this.bcryptHashRounds = Number(this.configService.get('HASH_ROUNDS'));
  }

  async register(
    { email, password, nickname, birthdate }: RegisterUserDTO,
    userDevice?: string,
  ) {
    const [userWithThisEmail, userWithThisNickname] = [
      await this.usersService.findOneByEmail(email),
      await this.usersService.findOneByNickname(nickname),
    ];
    if (userWithThisEmail !== null) {
      throw new ConflictException('This email address is already taken')
    } else if (userWithThisNickname !== null) {
      throw new ConflictException('This nickname is already taken')
    }

    const hashedPassword = await hash(password, this.bcryptHashRounds);
    const updatedUserInfo: TRegisterData = {
      email,
      nickname,
      birthdate,
      passwordHash: hashedPassword,
    };
    const userId = await this.usersService.createUser(updatedUserInfo);
    const userSessionId = await this.authSessionService.createSession(
      userId,
      userDevice ?? 'unknown',
    );
    const accessToken = this.authTokenService.generateAccessToken({
      userId,
      userSessionId,
      roles: [Roles.USER],
    });
    const refreshToken = this.authTokenService.generateRefreshToken({
      userId,
      userSessionId,
    });

    return { accessToken, refreshToken };
  }

  async login(
    { emailOrNickname, password }: LoginUserDTO,
    userDevice: string,
  ) {
    const foundUser =
      await this.usersService.findOneByEmailOrNickname(emailOrNickname);
    const passwordToCompare = foundUser
      ? foundUser.passwordHash
      : '\$2b\$15\$abcdefghijklmnopqrstuvwx';
    const compareResult = await compare(password, passwordToCompare);
    if (!foundUser || !compareResult) {
      throw new UnauthorizedException('Wrong email/nickname or password');
    }
    if (!userDevice) {
      throw new UnauthorizedException('Header "User-Agent" needed')
    }

    /**
     * Мы удаляем дубликаты сессий из базы, так как если пользователь почистит куки, то при повторном логине новая сессия добавится, а старая никуда
     */
    await this.authSessionService.removeSession(foundUser.id, userDevice)

    const sessionId = await this.authSessionService.createSession(
      foundUser.id,
      userDevice,
    );
    const accessToken = this.authTokenService.generateAccessToken({
      userId: foundUser.id,
      userSessionId: sessionId,
      roles: foundUser.roles,
    });
    const refreshToken = this.authTokenService.generateRefreshToken({
      userId: foundUser.id,
      userSessionId: sessionId,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(user: TUserInRequest) {
    if (!(await this.authRepository.checkSession(user.sid))) {
      throw new UnauthorizedException('Session does not exist');
    }
    const foundUser = (await this.usersService.findOneById(user.sub))!;
    const newAccessToken = this.authTokenService.generateAccessToken({
      userId: user.sub,
      userSessionId: user.sid,
      roles: foundUser.roles,
    });
    return newAccessToken;
  }

  async logout(userId: string, userDevice: string) {
    await this.authSessionService.removeSession(userId, userDevice);
  }

  async logoutAll(userId: string) {
    await this.authSessionService.removeAllSessions(userId);
  }
}
