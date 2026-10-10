import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { ConfigService } from '@nestjs/config';
import { addStringTime } from '../../utils/date-and-time';
import ms from 'ms';

@Injectable()
export class AuthSessionService {
  private sessionMaxAgeTime: ms.StringValue;

  constructor(
    private authRepository: AuthRepository,
    private configService: ConfigService,
  ) {
    this.sessionMaxAgeTime = this.configService.getOrThrow('REFRESH_TOKEN_EXP');
  }

  async createSession(userId: string, userDevice: string) {
    const sessionExpiresAt = new Date(
      addStringTime(Date.now(), this.sessionMaxAgeTime),
    ).toISOString();
    const sessionId = await this.authRepository.createSession({
      userId,
      userDevice,
      sessionExpiresAt,
    });
    return sessionId;
  }

  async checkSession(sid: string) {
    return this.authRepository.checkSession(sid);
  }

  async removeSession(userId: string, userDevice: string) {
    this.authRepository.removeSession(userId, userDevice)
  }    

  async removeAllSessions(userId: string) {
    this.authRepository.removeAllSessions(userId)
  }
}
