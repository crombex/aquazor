import { AuthGuard } from './auth.guard';
import { ConfigService } from '@nestjs/config';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new AuthGuard(new ConfigService())).toBeDefined();
  });
});
