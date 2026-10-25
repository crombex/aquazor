import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionsRepository } from './sessions.repository';
import { ConfigService } from '@nestjs/config';
import { addStringTime } from '../../common/utils/date-and-time';
import ms from 'ms';
import { mapKeysToCamelCase } from '../../common/utils/change-case';
import { SessionEntity } from './sessions.types';

@Injectable()
export class SessionsService {
  private sessionMaxAgeTime: ms.StringValue;

  constructor(
    private sessionsRepository: SessionsRepository,
    private configService: ConfigService,
  ) {
    this.sessionMaxAgeTime = this.configService.getOrThrow('REFRESH_TOKEN_EXP');
  }

  async createSession(userId: string, userDevice: string) {
    const sessionExpiresAt = new Date(
      addStringTime(Date.now(), this.sessionMaxAgeTime),
    ).toISOString();
    const sessionId = await this.sessionsRepository.createSession({
      userId,
      userDevice,
      sessionExpiresAt,
    });
    return sessionId;
  }

  async findSession(sid: string) {
    const session = await this.sessionsRepository.findSession(sid);
    if (session) {
      const mappedSession = mapKeysToCamelCase<SessionEntity>(session);
      if (new Date(mappedSession.expiredAt) > new Date()) {
        return mappedSession;
      } else {
        await this.sessionsRepository.removeSessionById(mappedSession.id);
        throw new UnauthorizedException('Session expired');
      }
    } else {
      throw new UnauthorizedException('Session not found');
    }
  }

  async removeSessionByUserIdAndDevice(userId: string, userDevice: string) {
    await this.sessionsRepository.removeSessionByUserIdAndDevice(userId, userDevice);
  }

  async removeSessionById(id: string) {
    await this.sessionsRepository.removeSessionById(id)
  }

  async removeAllSessions(userId: string) {
    await this.sessionsRepository.removeAllSessions(userId);
  }
}
