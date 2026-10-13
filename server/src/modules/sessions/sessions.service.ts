import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionsRepository } from './sessions.repository';
import { ConfigService } from '@nestjs/config';
import { addStringTime } from '../../utils/date-and-time';
import ms from 'ms';
import { mapKeysToCamelCase } from '../../utils/change-case';
import { SessionEntity } from './sessions.entity';

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
      const mappedSession = mapKeysToCamelCase<SessionEntity>(session)
      if (new Date(mappedSession.expiredAt) > new Date()) {
        return mappedSession
      } else {
        await this.sessionsRepository.removeSessionById(mappedSession.id)
        throw new UnauthorizedException('Session expired')
      }
    } else {
      throw new UnauthorizedException('Session not found')
    }
  }

  async removeSession(userId: string, userDevice: string) {
    this.sessionsRepository.removeSession(userId, userDevice)
  }    

  async removeAllSessions(userId: string) {
    this.sessionsRepository.removeAllSessions(userId)
  }
}
